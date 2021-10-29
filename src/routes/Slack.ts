import { Request, Response } from 'express';
import { KeyPair, keyStores, connect } from "near-api-js";

export async function oauth(req: Request, res: Response) {

    const keyPair = KeyPair.fromRandom("ed25519");
    const publicKey = keyPair.getPublicKey().toString();

    console.log(req.headers)

    return res.redirect(
        `https://wallet.testnet.near.org/login/?title=Slack&public_key=${publicKey}&success_url=${req.headers['x-forwarded-proto']}%3A%2F%2F${req.headers.host}/api/oauth/near_wallet`)
}
