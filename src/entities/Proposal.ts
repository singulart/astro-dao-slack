export interface IProposal {
    id: string;
    transactionHash: string;
    proposalId: number;
    createdAt: string;
    daoId: string;
    proposer: string;
    description: string;
    status: string;
    kind: IProposalKind;
    dao: IDao;
}

export interface IProposalKind {
    type: string;
    tokenId: string;
    receiverId: string;
    amount: string;
    msg: string;
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