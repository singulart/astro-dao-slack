export interface IProposal {
    id: string;
    transactionHash: string;
    proposalId: number;
    createdAt: string;
    votePeriodEnd: string;
    daoId: string;
    proposer: string;
    description: string;
    status: string;
    kind: IProposalKind;
    dao: IDao;
    votes: Map<string, string>;
}

export interface IProposalKind {
    type: string;
}

export interface ITransferProposal extends IProposalKind {
    tokenId: string;
    memberId: string;
    role: string;
}

export interface IAddMemberProposal extends IProposalKind {
    tokenId: string;
    receiverId: string;
    amount: string;
    msg: string;
}

export interface IAddBountyProposal extends IProposalKind {
    description: string;
    token: string;
    amount: string;
    times: number;
    maxDeadline: string;
}

export interface IDaoConfig {
    name: string;
    purpose: string;
    metadata: string;
}

export interface IDao {
    isArchived: boolean;
    createdAt: string;
    transactionHash: string;
    id: string;
    config: IDaoConfig;
}



// AddBounty proposal

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

// {
//     "proposal": {
//       "description": "q$$$$",
//       "kind": {
//         "AddMemberToRole": {
//           "member_id": "hack.testnet",
//           "role": "China Government"
//         }
//       }
//     }
// }

// {
//     "proposal": {
//       "description": "ereeeer$$$$",
//       "kind": {
//         "RemoveMemberFromRole": {
//           "member_id": "hack.testnet",
//           "role": "Council"
//         }
//       }
//     }
// }