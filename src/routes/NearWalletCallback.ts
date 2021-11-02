import { Request, Response } from 'express';
import { KeyPair, keyStores, connect } from "near-api-js";
import { getKeyStore } from '../shared/functions';
import BN from 'bn.js';

// this is the callback that wallet.near.org would call in the end of the auth process
// this url is configured in slack.ts

// GET /api/oauth/near_wallet?account_id=isonar.testnet&public_key=ed25519%3A7Q7wBFdEwjKttF8t1Xi2sEskTnZxiszA21347NAAEfEd&all_keys=ed25519%3An1DfSCqckd9gT6Bx14ZJWPpgELMA8sAKXHRZUfKgzgW
const config = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
  };

export async function nearWalletCallback(req: Request, res: Response) {

    console.log(req.headers)
    const publicKey = req.query.public_key as string;
    const wallet = req.query.account_id as string;
    const store = getKeyStore()

    if(!publicKey || !wallet) {
        res.status(400);
    }

    const key = await store.getKey(config.networkId, publicKey)
    if(!key) {
        res.status(404);
    }

    await store.setKey(config.networkId, wallet, key);
    const near = await connect({...config, keyStore: store});

    const acc = await near.account(wallet);
    await acc.functionCall(publicKey, '*', 'add_proposal act_proposal', new BN(2500000000000))
    return res.send("DONE")
}
