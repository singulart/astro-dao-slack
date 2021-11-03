import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { getProposals, createProposal, voteForProposal } from './Proposals';
import { interactionCallback, optionsCallback } from './Slack';

// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

// Proposal-route
const proposalRouter = Router();
proposalRouter.post('/', getProposals);
proposalRouter.post('/vote', voteForProposal);

// Slack-route
const slackRouter = Router();
slackRouter.post('/interaction', interactionCallback);
slackRouter.get('/options', optionsCallback);



// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
baseRouter.use('/proposal', proposalRouter);
baseRouter.use('/slack', slackRouter);

export default baseRouter;
