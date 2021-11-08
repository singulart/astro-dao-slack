import { Request, Response } from 'express';
import { ISlackRequest } from '../entities/SlackRequest';
import { setupInitialPrompt } from '../templates/setup_initial';
import Axios from 'axios';

export async function setup(req: Request, res: Response) {

    const slackReq: ISlackRequest = req.body;
    await Axios.post(slackReq.response_url, setupInitialPrompt());

    return res.status(200).end();
}