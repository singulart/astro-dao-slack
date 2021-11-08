export interface ProposalStruct {
    proposal: Proposal;
}

export interface Proposal {
    description: string;
    kind: TransferProposalKind | BountyProposalKind | AddMemberProposalKind | RemoveMemberProposalKind;
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

export interface AddMemberProposalKind {
    AddMemberToRole: IMemberRole;
}

export interface RemoveMemberProposalKind {
    RemoveMemberFromRole: IMemberRole;
}

export interface IMemberRole {
    member_id: string;
    role: string;
}
