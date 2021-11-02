import { Request, Response } from 'express';
import Axios from 'axios';
import { proposalSlackPayload } from '../templates/proposal_payload';
import { IProposal } from '../entities/Proposal';
import SlackUserMappingDao from '../daos/SlackUserMapping/SlackUserMappingDao.mock'
import { ISlackRequest } from '../entities/SlackRequest';
import SlackUserMapping from '../entities/SlackUserMapping';
import { addNewKey, getKeyStore } from '../shared/functions';
import { KeyPair, keyStores, connect, transactions, utils } from "near-api-js";
import { PublicKey } from 'near-api-js/lib/utils';
import BN from 'bn.js';
import { CreateAccount } from 'near-api-js/lib/transaction';
import { Transfer } from 'near-api-js/lib/transaction';
import { DeployContract } from 'near-api-js/lib/transaction';
import { DeleteAccount } from 'near-api-js/lib/transaction';
import { DeleteKey } from 'near-api-js/lib/transaction';
import { AddKey } from 'near-api-js/lib/transaction';
import { Stake } from 'near-api-js/lib/transaction';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import borsh_1 from "borsh";



const persistenceDAL = new SlackUserMappingDao()

export async function getProposals(req: Request, res: Response) {
    //TODO add cron or similar tool to run this periodically
    //TODO add filter by createdAt
    const result = await Axios.get(`${process.env.ASTRO_API}/proposals`, 
        {
            params: {
                sort: 'createdAt,DESC', 
                limit: 1
            }
        })

    console.log(result.data['data']);
    await Promise.all(result.data.data?.map(async (proposal: IProposal) => {
      await Axios.post(`https://hooks.slack.com/services/${process.env.SLACK_HOOK}`, proposalSlackPayload(proposal)); 
    }));

    return res.status(200);
}


export async function createProposal(req: Request, res: Response) {
    //TODO validate the request signature: https://api.slack.com/authentication/verifying-requests-from-slack

    const contractId = 'china-open.sputnikv2.testnet'; //TODO

    // const tx = Buffer.from(
    //     'DgAAAHNpbmd1bGFydC5uZWFyAHEDsTIB8okaSeKdMxYYeV7vrRPaUm+vYtn9q+HjjYVuBIP3ZW4uAAARAAAAYmVycnljbHViLmVrLm5lYXKbhm5IkbVOmnwTxyerFij4GuzrY6I1shO+xlGwiQw0lAEAAAACCgAAAGJ1eV90b2tlbnMCAAAAe30A4FfrSBsAAAAAgPZK4ccCLRUAAAAAAAA=', 
    //     'base64');

    const config = {
        keyStore: getKeyStore(),
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
    };

    const near = await connect(config);
    const block = await near.connection.provider.block({ finality: 'final' })
    console.log(block.header.hash)
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const publicKey = PublicKey.fromString('DhLrVKpMavpYTnmfP8YKVWY1enQd1xQQDieU5cEAREES');
    // const newTransaction = transactions.createTransaction(
    //     'isonar.testnet',
    //     pubKey,
    //     'china-open.sputnikv2.testnet',
    //     BigInt(1),
    //     [
    //         transactions.functionCall(
    //             'act_proposal', 
    //             new TextEncoder()
    //                 .encode(JSON.stringify({action: 'VoteApprove', id: 4})), 
    //             new BN(2500000000000), 
    //             new BN(2500000000000)
    //         )
    //     ], 
    //     blockHash);

    const signerId = 'isonar.testnet';
    const nonce = new BN(1);
    const receiverId = 'china-open.sputnikv2.testnet';
    const actions = [
        transactions.functionCall(
            'act_proposal', 
            new TextEncoder()
                .encode(JSON.stringify({action: 'VoteApprove', id: 4})), 
            new BN(2500000000000), 
            new BN(2500000000000)
        )
    ];

    const newTransaction = new transactions.Transaction({ signerId, publicKey, nonce, receiverId, blockHash, actions})
    
    const serializedTransaction = Buffer.from(utils.serialize.serialize(transactions.SCHEMA, newTransaction)).toString('base64');
    // const serializedTransaction = Buffer.from(newTransaction.encode()).toString('base64');

    // const deserialized = transactions.Transaction.decode(Buffer.from(newTransaction.encode()));
    // const transactionz = serializedTransaction.split(',')
    // .map((str: string) => Buffer.from(str, 'base64'))
    // .map((buffer: Buffer) => utils.serialize.deserialize(transactions.SCHEMA, transactions.Transaction, buffer));

    // console.log(JSON.stringify(transactionz));
    // console.log(String.fromCharCode(...transactionz[0].actions[0].functionCall.args)); // this works

    return res.send(`<https://localhost:1234/sign/?transactions=${serializedTransaction}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet|Confirm your choice!> please`);
    // const store = getKeyStore()
    // const config = {
    //     keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    //     networkId: "testnet",
    //     nodeUrl: "https://rpc.testnet.near.org",
    // };

    // const near = await connect(config);
    // const acc = await near.account('xxx.testnet');
    // const callResult = await acc.functionCall({
    //     methodName: 'act_proposal',
    //     contractId: contractId,
    //     args: {action: 'VoteApprove', id: 4}
    // });
    // console.log(callResult);
}

// export async function createProposal(req: Request, res: Response) {
//     //TODO validate the request signature: https://api.slack.com/authentication/verifying-requests-from-slack

//     const contractId = 'china-open.sputnikv2.testnet'; //TODO

//     const slackReq: ISlackRequest = req.body;
//     const storedMapping = await persistenceDAL.findBySlackUser(slackReq.user_id);
//     if(storedMapping && storedMapping.daoWallet) {
//         console.log(`Found mapping between slack user ${slackReq.user_name} and wallet ${storedMapping.daoWallet}`);
//         return res.send(`Hello ${storedMapping.daoWallet}`);

//     } else {
//         console.log(`No mapping found between slack user ${slackReq.user_name} and DAO wallet. User didn't finish the connect wallet flow`)
//         if(!storedMapping) {
//             let newMapping = new SlackUserMapping(slackReq.user_id, slackReq.user_name);
//             await persistenceDAL.add(newMapping);
//         }
//         const publicKey = await addNewKey(slackReq.user_id);
//         return res.send(`<https://wallet.testnet.near.org/login/?title=Slack&public_key=${publicKey}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet&contract_id=${contractId}|Connect your wallet> first!`)
//     }

// }
