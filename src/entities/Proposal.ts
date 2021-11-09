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

export interface IMemberProposal extends IProposalKind {
    tokenId: string;
    memberId: string;
    role: string;
}

export interface ITransferProposal extends IProposalKind {
    tokenId: string;
    receiverId: string;
    amount: string;
}

export interface IAddBountyProposal extends IProposalKind {
    bounty: AddBountyProposal;
}

export interface AddBountyProposal {
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
    amount: string;
}