import { ISlackUserMapping } from '../../entities/SlackUserMapping';
import { ISlackUserMappingDao } from './SlackUserMappingDao';
import MockDaoMock from '../MockDb/MockDao.mock';



class SlackUserMappingDao extends MockDaoMock implements ISlackUserMappingDao {


    public async findBySlackUser(slackUser: string): Promise<ISlackUserMapping | undefined> {
        const db = await super.openDb();
        return db.slackMappings.find(mapping => 
                (mapping.slackUserId === slackUser || mapping.slackUsername === slackUser) && mapping.current
            )
    }

    public async findByWallet(wallet: string): Promise<ISlackUserMapping | null> {
        const db = await super.openDb();
        for (const mapping of db.slackMappings) {
            if (mapping.daoWallet === wallet) {
                return mapping;
            }
        }
        return null;
    }

    public async getAll(): Promise<ISlackUserMapping[]> {
        const db = await super.openDb();
        return db.slackMappings;
    }


    public async add(user: ISlackUserMapping): Promise<void> {
        const db = await super.openDb();
        db.slackMappings.push(user);
        await super.saveDb(db);
    }


    public async update(user: ISlackUserMapping): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.slackMappings[i].slackUserId === user.slackUserId || db.slackMappings[i].slackUsername === user.slackUsername) {
                db.slackMappings[i] = user;
                await super.saveDb(db);
                return;
            }
        }
        throw new Error('Slack mapping not found');
    }


    public async delete(id: number): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === id) {
                db.users.splice(i, 1);
                await super.saveDb(db);
                return;
            }
        }
        throw new Error('Slack mapping not found');
    }
}

export default SlackUserMappingDao;
