import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { createProposal, voteForProposal } from './Proposals';
import { interactionCallback, optionsCallback } from './Slack';
import { setup } from './AccountManagement';

// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

// Proposal-route
const proposalRouter = Router();
proposalRouter.post('/', createProposal);
proposalRouter.post('/vote', voteForProposal);

// Slack-route
const slackRouter = Router();
slackRouter.post('/interaction', interactionCallback);
slackRouter.post('/options', optionsCallback);

// preferences-route
const preferencesRouter = Router();
preferencesRouter.post('/', setup);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
baseRouter.use('/proposal', proposalRouter);
baseRouter.use('/slack', slackRouter);
baseRouter.use('/preferences', preferencesRouter);

export default baseRouter;
