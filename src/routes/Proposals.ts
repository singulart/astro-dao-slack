import { Request, Response } from 'express';
import Axios from 'axios';
import { proposalSlackPayload } from '../templates/proposal_payload';
import { IDao, IProposal } from '../entities/Proposal';
import SlackUserMappingDao from '../daos/SlackUserMapping/SlackUserMappingDao.mock'
import { ISlackRequest } from '../entities/SlackRequest';
import SlackUserMapping, { ISlackView } from '../entities/SlackUserMapping';
import { createProposalInitialModal } from '../templates/proposal_create_modal_initial';
import { KeyPair, connect, transactions, utils } from "near-api-js";
import BN from 'bn.js';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';

const receiverId = 'china-open.sputnikv2.testnet';


const persistenceDAL = new SlackUserMappingDao();

export async function getProposals(req: Request, res: Response) {
    //TODO add cron or similar tool to run this periodically
    //TODO add filter by createdAt
    const result = await Axios.get(`${process.env.ASTRO_API}/proposals`, 
        {
            params: {
                sort: 'createdAt,DESC', 
                limit: 1,
                s: {
                    daoId: receiverId
                }
            }
        })

    console.log(result.data['data']);
    await Promise.all(result.data.data?.map(async (proposal: IProposal) => {
      await Axios.post(`https://hooks.slack.com/services/${process.env.SLACK_HOOK}`, proposalSlackPayload(proposal)); 
    }));

    return res.status(200).end();
}


export async function voteForProposal(req: Request, res: Response) {
    //TODO validate the request signature: https://api.slack.com/authentication/verifying-requests-from-slack

    const config = {
        keyStore: new InMemoryKeyStore(),
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
    };

    const near = await connect(config);
    const block = await near.connection.provider.block({ finality: 'final' });
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const signerId = 'isonar1.testnet';
    const publicKey = KeyPair.fromRandom("ed25519").getPublicKey();
    const nonce = new BN(1);

    const methodName = 'act_proposal';
    const args = new TextEncoder().encode(JSON.stringify({action: 'VoteApprove', id: 7}));
    const gas = new BN(250000000000000);
    const deposit = new BN(0);
    const actions = [
        new transactions.Action(
            { 
                functionCall: new transactions.FunctionCall({methodName, args, gas, deposit}) 
            }
        )
    ];

    // create a new transaction object
    const newTransaction = new transactions.Transaction({ signerId, publicKey, nonce, receiverId, blockHash, actions})
    
    // serialize the transaction using Borsh and make Base64 string
    const serializedTransaction = Buffer.from(utils.serialize.serialize(transactions.SCHEMA, newTransaction)).toString('base64');

    // escape special characters 
    const escapedSerializedTransaction = serializedTransaction.replace(/\+/g, '%2B').replace(/\//g, '%2F');

    return res.send(`<https://wallet.testnet.near.org/sign/?transactions=${escapedSerializedTransaction}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet|Confirm your choice!> please`);
}

export async function createProposal(req: Request, res: Response) {
    //TODO validate the request signature: https://api.slack.com/authentication/verifying-requests-from-slack

    const slackReq: ISlackRequest = req.body;
    const storedMapping = await persistenceDAL.findBySlackUser(slackReq.user_id);

    if( !storedMapping ) {
        return res.send(`You need to connect a NEAR account. Please follow instructions in /setup command`);
    } else {

        if(storedMapping.daoWallet) {
            console.log(`Found mapping between slack user ${slackReq.user_name} and wallet ${storedMapping.daoWallet}`);
            console.log(req.headers);
            console.log(req.body);
            
            const getMyDaosRestApiResponse = await Axios.get(`${process.env.ASTRO_API}/daos/account-daos/${storedMapping.daoWallet}`);
            const daos: IDao[] = getMyDaosRestApiResponse.data;
    
            // see https://api.slack.com/surfaces/modals/using#opening_modals
            const viewOpen = await Axios.post('https://slack.com/api/views.open', 
                createProposalInitialModal(slackReq.trigger_id, '', '', '', daos), 
                { headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${process.env.BOT_TOKEN}`
                  }
                }); 
            console.log(viewOpen.data);
            
            // here we store the view id and hash, as per Slack documentation https://api.slack.com/surfaces/modals/using#updating_apis
            const viewData: ISlackView = viewOpen.data.view;
            storedMapping.createProposalView = {id: viewData.id, hash: viewData.hash};
            persistenceDAL.update(storedMapping);

            return res.status(200).end();    
        } else {
            console.log(`No mapping found between slack user ${slackReq.user_name} and DAO wallet. User didn't finish the connect wallet flow`)
            if(!storedMapping) {
                let newMapping = new SlackUserMapping(slackReq.user_id, slackReq.user_name);
                await persistenceDAL.add(newMapping);
            }
            return res.status(400).end();
        }

    }

}
