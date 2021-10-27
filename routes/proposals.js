var express = require('express');
var router = express.Router();
const Axios = require('axios');


router.get('/', async function(req, res, next) {
  const result = await Axios.get('https://api.app.astrodao.com/api/v1/proposals')

  console.log(result.data['data'])
  await Promise.all(result.data.data?.map(async (proposal) => {
    const daoId = proposal.dao.id
    const proposalId = proposal.proposalId
    await Axios.post('https://hooks.slack.com/services/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', 
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
  res.json({
    date: new Date().toISOString()
  })
});

module.exports = router;
