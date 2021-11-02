import logger from './Logger';
import path from "path";
import { KeyPair, keyStores, connect } from "near-api-js";

const homedir = require("os").homedir();

export const pErr = (err: Error) => {
    if (err) {
        logger.err(err);
    }
};

export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};


export const getKeyStore = () => {

    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
    return new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
}

export const addNewKey = async (slackUser: string): Promise<string>  => {

    const keyStore = getKeyStore();
    
    const config = {
        keyStore,
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org"
    };

    // const near = await connect(config);
    const keyPair = KeyPair.fromRandom("ed25519");
    const publicKey = keyPair.getPublicKey().toString();    
    await keyStore.setKey(config.networkId, publicKey, keyPair);

    return publicKey;  
}