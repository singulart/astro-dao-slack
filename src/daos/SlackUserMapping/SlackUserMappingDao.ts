import { ISlackUserMapping } from '../../entities/SlackUserMapping';


export interface ISlackUserMappingDao {
    findBySlackUser: (slackUser: string) => Promise<ISlackUserMapping | undefined>;
    findAllBySlackUser: (slackUser: string) => Promise<ISlackUserMapping[] | undefined>;
    findByWallet: (walletAddress: string) => Promise<ISlackUserMapping | null>;
    getAll: () => Promise<ISlackUserMapping[]>;
    add: (user: ISlackUserMapping) => Promise<void>;
    update: (user: ISlackUserMapping) => Promise<void>;
    delete: (user: ISlackUserMapping) => Promise<void>;
}