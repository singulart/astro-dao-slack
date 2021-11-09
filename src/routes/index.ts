import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { createProposal } from './Proposals';
import { interactionCallback } from './Slack';
import { setup } from './AccountManagement';
import { getBalance } from './Balance';

// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

// Proposal-route
const proposalRouter = Router();
proposalRouter.post('/', createProposal);

// Balance route
const balanceRouter = Router();
balanceRouter.post('/', getBalance);

// Slack-route
const slackRouter = Router();
slackRouter.post('/interaction', interactionCallback);

// preferences-route
const preferencesRouter = Router();
preferencesRouter.post('/', setup);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
baseRouter.use('/proposal', proposalRouter);
baseRouter.use('/slack', slackRouter);
baseRouter.use('/preferences', preferencesRouter);
baseRouter.use('/balance', balanceRouter);

export default baseRouter;
