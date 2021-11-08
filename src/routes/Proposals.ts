import { Request, Response } from 'express';
import { proposalSlackPayload } from '../templates/proposal_payload';
import { IDao, IProposal } from '../entities/Proposal';
import SlackUserMappingDao from '../daos/SlackUserMapping/SlackUserMappingDao.mock'
import { ISlackRequest } from '../entities/SlackRequest';
import SlackUserMapping, { ISlackView } from '../entities/SlackUserMapping';
import { createProposalInitialModal } from '../templates/proposal_create_modal_initial';
import dayjs from "dayjs";
import Axios from 'axios';


const persistenceDAL = new SlackUserMappingDao();

export async function getProposals(createdAgo: number, createdAgoUnit: string) {
    const createdAt = dayjs().subtract(createdAgo, createdAgoUnit); // current time minus some configurable number of time units
    const formattedDate = createdAt.toISOString();
    console.log(`Checking for new proposals created since ${formattedDate}`);
    const result = await Axios.get(`${process.env.ASTRO_API}/proposals`, 
        {
            params: {
                sort: 'createdAt,ASC', 
                filter: `createdAt||$gte||${formattedDate}`
            }
        })
    await Promise.all(result.data.data?.map(async (proposal: IProposal) => {
      const postResponse = await Axios.post(`https://hooks.slack.com/services/${process.env.SLACK_HOOK}`, proposalSlackPayload(proposal)); 
      if(postResponse.status === 200) {
        console.log(`Posted ${result.data.data?.length} proposals updates`);
      }
    }));
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
