import { Request, Response } from 'express';
import { ISlackInteraction } from '../entities/SlackRequest';
import Axios from "axios";
import { addAccountTextField } from '../templates/setup_add_account';
import { removeAccountTextField } from '../templates/setup_remove_account';
import SlackUserMappingDao from '../daos/SlackUserMapping/SlackUserMappingDao.mock';
import SlackUserMapping, { ISlackUserMapping } from '../entities/SlackUserMapping';
import { plainText } from '../templates/plaintext';
import { createProposalInitialModal } from '../templates/proposal_create_modal_initial';
import { IDao } from '../entities/Proposal';
import { TransferProposal } from '../transactions/TransferProposal';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { createSerializedTransaction } from '../shared/txMaker';

const persistenceDAL = new SlackUserMappingDao();


export async function interactionCallback(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    const request: ISlackInteraction = JSON.parse(req.body.payload);
    const actions = request.actions;

    if(request.type === 'view_submission') {
        const currentUser = await persistenceDAL.findBySlackUser(request.user.id);
        const proposalType = request.view.state.values.proposal_create_modal.proposal_type_select_action.selected_option.value;
        const dao: string = request.view.state.values.proposal_create_modal.proposal_select_dao.selected_option.text.text;
        
        if(proposalType === 'proposal_type_payout') {
            const recepient = request.view.state.values.payout_recipient.payout_recipient.value;
            const amount = request.view.state.values.payout_amount.payout_amount.value;
            const details = request.view.state.values.payout_details.payout_details.value;
            const link = request.view.state.values.payout_link.payout_link.value; // TODO
    
            if(!recepient || !dao || !amount) {
                res.status(400).send('Invalid form data').end();
            }
    
            const payoutTransaction: TransferProposal = {
                proposal: {
                    description: details,
                    kind: {
                        Transfer: {
                            token_id: '',
                            amount: parseNearAmount(amount) as string,
                            receiver_id: recepient
                        }
                    }    
                }
            }
            console.log(JSON.stringify(payoutTransaction)); 

            // build a serialized transaction 
            const escapedSerializedTransaction = await createSerializedTransaction(currentUser?.daoWallet as string, dao, 'add_proposal', payoutTransaction);

            return res.send(`<https://wallet.testnet.near.org/sign/?transactions=${escapedSerializedTransaction}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet|Sign the transaction!>`);
        }
        return res.status(201).end();
    } else if(actions[0]) {
        if(actions[0].action_id === 'action_add_account_clicked') {
            await Axios.post(request.response_url, addAccountTextField()); 
        } else if(actions[0].action_id === 'action_remove_account_clicked') {
            await Axios.post(request.response_url, removeAccountTextField()); 
        } else if(actions[0].action_id === 'action_view_accounts_clicked') {
            const accounts = await persistenceDAL.findAllBySlackUser(request.user.username);
            if( accounts && accounts.length > 0) {
                const listAccounts = accounts.map( (a: ISlackUserMapping) => 
                        `\`${a.daoWallet}\` ${a.current ? ' *[Current]* ' : ''}\n`
                    )
                .join('');
                await Axios.post(request.response_url, plainText(listAccounts));
            }
        } else if(actions[0].action_id === 'action_add_account_entered') {
            await persistenceDAL.add(new SlackUserMapping(request.user.id, request.user.username, actions[0].value, true));
            await Axios.post(request.response_url, plainText(`Account \`${actions[0].value}\` added`)); 
        } else if(actions[0].action_id === 'action_remove_account_entered') {
            await persistenceDAL.delete(new SlackUserMapping(request.user.id, request.user.username, actions[0].value));
            await Axios.post(request.response_url, plainText(`Account \`${actions[0].value}\` removed`)); 
        } else if(actions[0].action_id === 'proposal_type_select_action') {
            const selectedProposalType = request.actions[0].selected_option.value;
            console.log(`Selected ${selectedProposalType}`);
    
            const currentUser = await persistenceDAL.findBySlackUser(request.user.id);
            const getMyDaosRestApiResponse = await Axios.get(`${process.env.ASTRO_API}/daos/account-daos/${currentUser?.daoWallet}`);
            const daos: IDao[] = getMyDaosRestApiResponse.data;
        
            // see https://api.slack.com/surfaces/modals/using#updating_apis
            const viewOpen = await Axios.post('https://slack.com/api/views.update', 
                createProposalInitialModal('', currentUser?.createProposalView.id, 
                    currentUser?.createProposalView.hash, selectedProposalType, daos), 
                { headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${process.env.BOT_TOKEN}`
                    }
                }); 
            console.log(viewOpen.data);
        } 
    }

    return res.status(201).end();
}

export async function optionsCallback(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);
    return res.status(201).end();
}
