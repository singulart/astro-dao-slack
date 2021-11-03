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
    kind: IProposal;
    dao: IDao;
    votes: Map<string, string>;
}

export interface IProposal {
    type: string;
}

export interface ITransferProposal extends IProposal {
    tokenId: string;
    memberId: string;
    role: string;
}

export interface IAddMemberProposal extends IProposal {
    tokenId: string;
    receiverId: string;
    amount: string;
    msg: string;
}

export interface IAddBountyProposal extends IProposal {
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