import { Request, Response } from "express";
import Axios from 'axios';
import { ISlackRequest } from "../entities/SlackRequest";
import { IDao } from "../entities/Proposal";
import { formatNearAmount } from "near-api-js/lib/utils/format";
import logger from "../shared/Logger";

export const getBalance = async (req: Request, res: Response) => {

    const slackReq: ISlackRequest = req.body;

    if(!slackReq.text || !slackReq.text.trim()) {
        return res.send("Usage: `/balance <DAO name>`");
    }

    try {
        const daoResponseEntity = await Axios.get(`${process.env.ASTRO_API}/daos/${slackReq.text}`);

        const dao: IDao = daoResponseEntity.data;

        return res.send(`\`${dao.id}\` treasury balance: *NEAR ${formatNearAmount(dao.amount, 2)}*`);
    } catch(error) {
        logger.err(error);
        return res.send("No info");
    }
}
