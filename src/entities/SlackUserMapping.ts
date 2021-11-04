export interface ISlackUserMapping {
    slackUserId: string;
    slackUsername: string;
    daoWallet: string;
    current: boolean;
    createProposalView: ISlackView;
}

export interface ISlackView {
    id: string;
    hash: string;
}


class SlackUserMapping implements ISlackUserMapping {

    public slackUserId: string;
    public slackUsername: string;
    public daoWallet: string;
    public current: boolean;
    public createProposalView: ISlackView;

    constructor(slackUserId: string, slackUsername: string, daoWallet?: string, current?: boolean) {
        this.slackUserId = slackUserId;
        this.slackUsername = slackUsername;
        this.daoWallet = daoWallet || '';
        this.current = current || false;
        this.createProposalView = {id: '', hash: ''};
    }

}

export default SlackUserMapping;
