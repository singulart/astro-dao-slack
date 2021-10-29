import { Request, Response } from 'express';
import Axios from 'axios';
import { KeyPair, keyStores, connect } from "near-api-js";
import { proposalSlackPayload } from '../templates/proposal_payload';

export async function getProposals(req: Request, res: Response) {

    console.log(req.headers)

    const result = await Axios.get(`${process.env.ASTRO_API}/proposals`, 
        {
            params: {
                sort: 'createdAt,DESC', 
                limit: 1
            }
        })

    console.log(result.data['data'])
    await Promise.all(result.data.data?.map(async (proposal: any) => {
      const daoId = proposal.dao.id
      const proposalId = proposal.proposalId
      await Axios.post(`https://hooks.slack.com/services/${process.env.SLACK_HOOK}`, proposalSlackPayload())    
    }));

    return res.status(200)
}
