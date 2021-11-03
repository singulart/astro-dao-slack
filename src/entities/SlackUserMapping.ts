export interface ISlackUserMapping {
    slackUserId: string;
    slackUsername: string;
    daoWallet: string;
    current: boolean;
}


class SlackUserMapping implements ISlackUserMapping {

    public slackUserId: string;
    public slackUsername: string;
    public daoWallet: string;
    public current: boolean;

    constructor(slackUserId: string, slackUsername: string, daoWallet?: string, current?: boolean) {
        this.slackUserId = slackUserId;
        this.slackUsername = slackUsername;
        this.daoWallet = daoWallet || '';
        this.current = current || false;
    }

}

export default SlackUserMapping;
