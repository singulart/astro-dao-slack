import { Request, Response } from 'express';
import { ISlackInteraction } from '../entities/SlackRequest';
import Axios from "axios";
import { addAccountTextField } from '../templates/setup_add_account';
import { removeAccountTextField } from '../templates/setup_remove_account';
import SlackUserMappingDao from '../daos/SlackUserMapping/SlackUserMappingDao.mock';
import SlackUserMapping from '../entities/SlackUserMapping';
import { plainText } from '../templates/plaintext';

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
    } else if(actions[0].action_id === 'action_add_account_entered') {
        await persistenceDAL.add(new SlackUserMapping(request.user.id, request.user.username, actions[0].value, true));
        await Axios.post(request.response_url, plainText(`Account \`${actions[0].value}\` added`)); 
    } else if(actions[0].action_id === 'action_remove_account_entered') {
        await persistenceDAL.delete(new SlackUserMapping(request.user.id, request.user.username, actions[0].value));
        await Axios.post(request.response_url, plainText(`Account \`${actions[0].value}\` removed`)); 
    } 

    return res.status(201).end();
}

export async function optionsCallback(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    return res.status(201).end();
}
