import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { getProposals, createProposal } from './Proposals';
import { oauth } from './Slack';
import { nearWalletCallback } from './NearOauth';

// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

// Proposal-route
const proposalRouter = Router();
proposalRouter.post('/', createProposal);

// Proposal-route
const oauthRouter = Router();
oauthRouter.get('/', oauth);
oauthRouter.get('/near_wallet', nearWalletCallback);



// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
baseRouter.use('/proposal', proposalRouter);
baseRouter.use('/oauth', oauthRouter);

export default baseRouter;
