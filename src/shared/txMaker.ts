import { connect, KeyPair, transactions, utils } from "near-api-js";
import BN from 'bn.js';
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { ProposalStruct } from "../transactions/TransferProposal";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";

export const createSerializedTransaction = 
    async (signerId: string, receiverId: string, contractMethod: string, transactionPayload: ProposalStruct): Promise<string> => {

    const config = {
        keyStore: new InMemoryKeyStore(),
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
    };

    const near = await connect(config);
    const block = await near.connection.provider.block({ finality: 'final' });
    const blockHash = utils.serialize.base_decode(block.header.hash);

    const publicKey = KeyPair.fromRandom("ed25519").getPublicKey();
    const nonce = new BN(1);

    const methodName = contractMethod;
    const args = new TextEncoder().encode(JSON.stringify(transactionPayload));
    const gas = new BN(250000000000000);
    const deposit = new BN(parseNearAmount("0.1") as string); // TODO must come from DAO settings
    const actions = [
        new transactions.Action(
            { 
                functionCall: new transactions.FunctionCall({methodName, args, gas, deposit}) 
            }
        )
    ];

    // create a new transaction object
    const newTransaction = new transactions.Transaction({ signerId, publicKey, nonce, receiverId, blockHash, actions})
    
    // serialize the transaction using Borsh and make Base64 string
    const serializedTransaction = Buffer.from(utils.serialize.serialize(transactions.SCHEMA, newTransaction)).toString('base64');

    // escape special characters 
    return serializedTransaction.replace(/\+/g, '%2B').replace(/\//g, '%2F');
}