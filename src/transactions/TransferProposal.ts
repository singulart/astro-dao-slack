export interface ProposalStruct {
    proposal: Proposal;
}

export interface Proposal {
    description: string;
    kind: TransferProposalKind | BountyProposalKind;
}

export interface TransferProposalKind {
    Transfer: ITransfer;
}

export interface ITransfer {
    token_id: string;
    receiver_id: string;
    amount: string;
}


export interface BountyProposalKind {
    AddBounty: IBounty;
}

export interface IBounty {
    bounty: BountyPayload;
}

export interface BountyPayload {
    description: string;
    token: string;
    amount: string;
    times: number;
    max_deadline: string;
}

// {
    //     "proposal": {
    //       "description": "444$$$$",
    //       "kind": {
    //         "AddBounty": {
    //           "bounty": {
    //             "description": "444$$$$",
    //             "token": "",
    //             "amount": "444000000000000000000000000",
    //             "times": 3,
    //             "max_deadline": "259200000000000"
    //           }
    //         }
    //       }
    //     }
    // }
    