import { Request, Response } from 'express';
import { KeyPair, keyStores, connect } from "near-api-js";

// this is the callback that wallet.near.org would call in the end of the auth process
// this url is configured in slack.ts

// GET /api/oauth/near_wallet?account_id=isonar.testnet&public_key=ed25519%3A7Q7wBFdEwjKttF8t1Xi2sEskTnZxiszA21347NAAEfEd&all_keys=ed25519%3An1DfSCqckd9gT6Bx14ZJWPpgELMA8sAKXHRZUfKgzgW

export async function nearWalletCallback(req: Request, res: Response) {

    console.log(req.headers)

    return res.send("DONE")
}
