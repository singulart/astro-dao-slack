import { Request, Response } from 'express';
import Axios from 'axios';
import { proposalSlackPayload } from '../templates/proposal_payload';
import { IProposal } from '../entities/Proposal';
import SlackUserMappingDao from '../daos/SlackUserMapping/SlackUserMappingDao.mock'
import { ISlackRequest } from '../entities/SlackRequest';
import SlackUserMapping from '../entities/SlackUserMapping';


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

    const slackReq: ISlackRequest = req.body;
    const storedMapping = await persistenceDAL.findBySlackUser(slackReq.user_id);
    if(storedMapping && storedMapping.daoWallet) {
        console.log(`Found mapping between slack user ${slackReq.user_name} and wallet ${storedMapping.daoWallet}`);
        return res.send(`Hello ${storedMapping.daoWallet}`);

    } else {
        console.log(`No mapping found between slack user ${slackReq.user_name} and DAO wallet. User didn't finish the connect wallet flow`)
        if(!storedMapping) {
            let newMapping = new SlackUserMapping(slackReq.user_id, slackReq.user_name);
            await persistenceDAL.add(newMapping);
        }
        return res.send(`<https://api.slack.com/oauth?client_id=${process.env.APP_CLIENT_ID}&scope=app_mentions%3Aread+channels%3Ahistory+channels%3Aread+chat%3Awrite+chat%3Awrite.public+commands+dnd%3Aread+groups%3Ahistory+groups%3Aread+groups%3Awrite+im%3Ahistory+im%3Aread+im%3Awrite+links%3Aread+links%3Awrite+mpim%3Ahistory+mpim%3Aread+mpim%3Awrite+reactions%3Aread+reactions%3Awrite+team%3Aread+users.profile%3Aread+users%3Aread+users%3Aread.email&user_scope=channels%3Aread%2Cchannels%3Awrite%2Cgroups%3Aread%2Cgroups%3Awrite%2Cim%3Aread%2Clinks%3Aread%2Clinks%3Awrite%2Cmpim%3Aread&redirect_uri=https%3A%2F%2F4a7d-77-120-246-217.ngrok.io%2Fapi%2Foauth&state=%7B%22source%22%3A%22slack-app-directory%22%2C%22state%22%3A%227063796dad7a92ee1c7c901fc9faa6bb8cf9a90e3a5abc832be438d8fd661ca1%22%7D&granular_bot_scope=1&single_channel=0&install_redirect=&tracked=1&response_type=code&team=|Connect your wallet> first!`)
    }

}
