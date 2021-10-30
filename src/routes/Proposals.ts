import { Request, Response } from 'express';
import Axios from 'axios';
import { proposalSlackPayload } from '../templates/proposal_payload';
import { IProposal } from '../entities/Proposal';

export async function getProposals(req: Request, res: Response) {
    //TODO validate the request signature: https://api.slack.com/authentication/verifying-requests-from-slack

    console.log(`Got a request. Headers=${JSON.stringify(req.headers)}. Body=${JSON.stringify(req.body)}`)

    const result = await Axios.get(`${process.env.ASTRO_API}/proposals`, 
        {
            params: {
                sort: 'createdAt,DESC', 
                limit: 1
            }
        })

    console.log(result.data['data'])
    await Promise.all(result.data.data?.map(async (proposal: IProposal) => {
      await Axios.post(`https://hooks.slack.com/services/${process.env.SLACK_HOOK}`, proposalSlackPayload(proposal))    
    }));

    return res.status(200)
}
