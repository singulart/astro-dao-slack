export interface TransferProposal {
    proposal: Proposal;
}

export interface Proposal {
    description: string;
    kind: TransferProposalKind;
}

export interface TransferProposalKind {
    Transfer: ITransfer;
}

export interface ITransfer {
    token_id: string;
    receiver_id: string;
    amount: string;
}