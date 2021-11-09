import { Request, Response } from 'express';
import { ISlackInteraction } from '../entities/SlackRequest';
import Axios from "axios";
import { addAccountTextField } from '../templates/setup_add_account';
import { removeAccountTextField } from '../templates/setup_remove_account';
import SlackUserMappingDao from '../daos/SlackUserMapping/SlackUserMappingDao.mock';
import SlackUserMapping, { ISlackUserMapping, ISlackView } from '../entities/SlackUserMapping';
import { plainText } from '../templates/plaintext';
import { createProposalInitialModal } from '../templates/proposal_create_modal_initial';
import { IDao } from '../entities/Proposal';
import { ProposalStruct } from '../transactions/TransferProposal';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { createSerializedTransaction } from '../shared/txMaker';
import { intervalToSeconds } from '../shared/functions';
import { SEPARATOR } from '../templates/proposal_payload';

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
    
            const payoutTransaction: ProposalStruct = {
                proposal: {
                    description: details ? details : '',
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

            const sentMessage = await Axios.post('https://slack.com/api/chat.postEphemeral', 
            {
                channel: request.user.id,
                user: request.user.id,
                text: `<https://wallet.testnet.near.org/sign/?transactions=${escapedSerializedTransaction}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet|Sign the transaction!>`
            },
             
            { headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${process.env.BOT_TOKEN}`
              }
            }); 
            console.log(`Direct message to sign transaction sent: ${sentMessage.data.ok}`);            
        } else if(proposalType === 'proposal_type_bounty') {
            const amount = request.view.state.values.bounty_amount.bounty_amount.value;
            const details = request.view.state.values.bounty_details.bounty_details.value;
            const link = request.view.state.values.bounty_link.bounty_link.value; // TODO
            const claimsNumber = request.view.state.values.bounty_num_claims.bounty_num_claims.value;
            const completeIn = request.view.state.values.bounty_complete_in_1.bounty_complete_in_1.value;
            const completeInPeriod = request.view.state.values.bounty_complete_in_2.bounty_complete_in_2.selected_option.value;
            
    
            if(!dao || !amount || !claimsNumber || !completeIn || !completeInPeriod) {
                res.status(400).send('Invalid form data').end();
            }
    
            const payoutTransaction: ProposalStruct = {
                proposal: {
                    description: details ? details : '',
                    kind: {
                        AddBounty: {
                            bounty: {
                                description: details ? details : '',
                                token: '',
                                amount: parseNearAmount(amount) as string,
                                times: +claimsNumber,
                                max_deadline: intervalToSeconds(completeIn, completeInPeriod)
                            }
                        }
                    }    
                }
            }
            console.log(JSON.stringify(payoutTransaction)); 

            // build a serialized transaction 
            const escapedSerializedTransaction = await createSerializedTransaction(currentUser?.daoWallet as string, dao, 'add_proposal', payoutTransaction);

            const sentMessage = await Axios.post('https://slack.com/api/chat.postEphemeral', 
            {
                channel: request.user.id,
                user: request.user.id,
                text: `<https://wallet.testnet.near.org/sign/?transactions=${escapedSerializedTransaction}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet|Sign the transaction!>`
            },
             
            { headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${process.env.BOT_TOKEN}`
              }
            }); 
            console.log(`Direct message to sign transaction sent: ${sentMessage.data.ok}`);  

        } else if(['proposal_type_add_member', 'proposal_type_remove_member'].includes(proposalType)) {
            const account = request.view.state.values.member_proposal_account.member_account.value;
            const group = request.view.state.values.member_proposal_group.member_group.value;
            const description = request.view.state.values.member_proposal_description.member_description.value;

    
            if(!dao || !account || !group) {
                res.status(400).send('Invalid form data').end();
            }
    
            const memberTransaction: ProposalStruct = proposalType === 'proposal_type_add_member' ?
            {
                proposal: {
                    description: description ? description : '',
                    kind: {
                        AddMemberToRole: {
                            member_id: account,
                            role: group
                        }
                    }    
                }
            } : 
            {
                proposal: {
                    description: description ? description : '',
                    kind: {
                        RemoveMemberFromRole: {
                            member_id: account,
                            role: group
                        }
                    }    
                }
            }
            console.log(JSON.stringify(memberTransaction)); 

            // build a serialized transaction 
            const escapedSerializedTransaction = await createSerializedTransaction(currentUser?.daoWallet as string, dao, 'add_proposal', memberTransaction);

            const sentMessage = await Axios.post('https://slack.com/api/chat.postEphemeral', 
            {
                channel: request.user.id,
                user: request.user.id,
                text: `<https://wallet.testnet.near.org/sign/?transactions=${escapedSerializedTransaction}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet|Sign the transaction!>`
            },
             
            { headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${process.env.BOT_TOKEN}`
              }
            }); 
            console.log(`Direct message to sign transaction sent: ${sentMessage.data.ok}`);            
        }
        return res.status(200).end();
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
            if(!currentUser) {
                return res.status(404).end('No current user');
            }
            const getMyDaosRestApiResponse = await Axios.get(`${process.env.ASTRO_API}/daos/account-daos/${currentUser?.daoWallet}`);
            const daos: IDao[] = getMyDaosRestApiResponse.data;
        
// console.log(createProposalInitialModal('', currentUser?.createProposalView.id, currentUser?.createProposalView.hash, selectedProposalType, daos));

            // see https://api.slack.com/surfaces/modals/using#updating_apis
            const viewOpen = await Axios.post('https://slack.com/api/views.update', 
                createProposalInitialModal('', currentUser?.createProposalView.id, 
                    currentUser?.createProposalView.hash, selectedProposalType, daos), 
                { headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${process.env.BOT_TOKEN}`
                    }
                }); 
            
            // here we store the view id and hash, as per Slack documentation https://api.slack.com/surfaces/modals/using#updating_apis
            const viewData: ISlackView = viewOpen.data.view;
            currentUser.createProposalView = {id: viewData.id, hash: viewData.hash};
            persistenceDAL.update(currentUser);
            
        } else if(['VoteApprove', 'VoteReject', 'VoteRemove'].includes(actions[0].action_id)) { 

            // ***************************** Voting ************************************

            const currentUser = await persistenceDAL.findBySlackUser(request.user.id);
            if(!currentUser) {
                return res.status(404).end('No current user');
            }

            const params = actions[0].value.split(SEPARATOR);
            const dao = params[1];
            const payload = {action: params[0], id: +params[2]}

            // build a serialized transaction 
            const escapedSerializedTransaction = await createSerializedTransaction(currentUser?.daoWallet as string, dao, 'act_proposal', payload);
            await Axios.post(request.response_url, 
                plainText(`<https://wallet.testnet.near.org/sign/?transactions=${escapedSerializedTransaction}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet|Sign the transaction!>`)); 
        }
    }

    return res.status(201).end();
}