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

    constructor(mapping: ISlackUserMapping) {
        this.slackUserId = mapping.slackUserId;
        this.slackUsername = mapping.slackUsername;
        this.daoWallet = mapping.daoWallet;
        this.accessKey = mapping.accessKey;
    }

}

export default SlackUserMapping;
