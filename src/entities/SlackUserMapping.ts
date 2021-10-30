export interface ISlackUserMapping {
    slackUserId: string;
    slackUsername: string;
    daoWallet: string;
    accessKey: string;
}


class SlackUserMapping implements ISlackUserMapping {

    public slackUserId: string;
    public slackUsername: string;
    public daoWallet: string;
    public accessKey: string;

    constructor(slackUserId: string, slackUsername: string, daoWallet?: string, accessKey?: string) {
        this.slackUserId = slackUserId;
        this.slackUsername = slackUsername;
        this.daoWallet = daoWallet || '';
        this.accessKey = accessKey || '';
    }

}

export default SlackUserMapping;
