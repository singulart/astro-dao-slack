import { Request, Response } from 'express';
import Axios from 'axios';
import { KeyPair, keyStores, connect } from "near-api-js";

export async function getProposals(req: Request, res: Response) {

    console.log(req.headers)

    const result = await Axios.get('https://api.app.astrodao.com/api/v1/proposals', 
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
      await Axios.post(`https://hooks.slack.com/services/${process.env.SLACK_HOOK}`, 
      {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn', 
              text: `New Proposal in DAO ${daoId} has been added. <https://app.astrodao.com/dao/${daoId}?proposal=${daoId}-${proposalId}|View it in Astro App>`
            }
          }
        ]
      })    
    }));

    return res.json({
      date: new Date().toISOString()
    })
}
