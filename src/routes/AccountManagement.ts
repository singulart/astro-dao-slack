import { Request, Response } from 'express';
import { ISlackRequest } from '../entities/SlackRequest';
import { setupInitialPrompt } from '../templates/setup_initial';
import Axios from 'axios';

export async function setup(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    const slackReq: ISlackRequest = req.body;
    await Axios.post(slackReq.response_url, setupInitialPrompt());

    return res.status(200).end();
}


export async function addAccount(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    return res.status(201).end();
}

export async function deleteAccount(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    return res.status(201).end();
}

export async function viewAccounts(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    return res.status(201).end();
}
