import { Request, Response } from 'express';

export async function interactionCallback(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    return res.status(201).end();
}

export async function optionsCallback(req: Request, res: Response) {

    console.log(req.headers);
    console.log(req.body);

    return res.status(201).end();
}
