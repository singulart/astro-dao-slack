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

const persistenceDAL = new SlackUserMappingDao();


export async function interactionCallback(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    const request: ISlackInteraction = JSON.parse(req.body.payload);
    
    const actions = request.actions;
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
    }  else if(actions[0].action_id === 'proposal_type_select_action') {
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

    return res.status(201).end();
}

export async function optionsCallback(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);
    return res.status(201).end();
}
