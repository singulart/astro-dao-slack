import { ISlackUserMapping } from '../../entities/SlackUserMapping';
import { ISlackUserMappingDao } from './SlackUserMappingDao';
import MockDaoMock from '../MockDb/MockDao.mock';
import { IDatabase } from '../MockDb/MockDao.mock';


class SlackUserMappingDao extends MockDaoMock implements ISlackUserMappingDao {


    public async findBySlackUser(slackUser: string): Promise<ISlackUserMapping | undefined> {
        const db = await super.openDb();
        return db.slackMappings.find(mapping => 
                (mapping.slackUserId === slackUser || mapping.slackUsername === slackUser) && mapping.current
            )
    }

    public async findAllBySlackUser(slackUser: string): Promise<ISlackUserMapping[] | undefined> {
        const db = await super.openDb();
        return db.slackMappings.filter(mapping => 
                mapping.slackUserId === slackUser || mapping.slackUsername === slackUser
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
        const existingMapping = await this.findBySlackUserAndAccount(db, user.slackUserId, user.daoWallet);
        if (! existingMapping) {
            db.slackMappings.push(user);
            await super.saveDb(db); 
            await this.unsetCurrentFlag(db, user.slackUserId, user.daoWallet);
        } else {
            console.log(`Mapping already exists: ${user.slackUserId} <-> ${user.daoWallet}`);
        }
    }


    public async update(user: ISlackUserMapping): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.slackMappings.length; i++) {
            if (db.slackMappings[i].daoWallet === user.daoWallet && (db.slackMappings[i].slackUserId === user.slackUserId || db.slackMappings[i].slackUsername === user.slackUsername) ) {
                db.slackMappings[i] = user;
                await super.saveDb(db);
                return;
            }
        }
        console.log(`Unknown mapping: ${user.slackUserId} <-> ${user.daoWallet}`);
        return;
    }


    public async delete(user: ISlackUserMapping): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.slackMappings.length; i++) {
            if (db.slackMappings[i].daoWallet === user.daoWallet && (db.slackMappings[i].slackUserId === user.slackUserId || db.slackMappings[i].slackUsername === user.slackUsername) ) {
                db.slackMappings.splice(i, 1);
                await super.saveDb(db);
                const others = (await this.findAllBySlackUserAndAccountNotEquals(db, user.slackUserId, user.daoWallet))
                if( others && others.length > 0) {
                    others[0].current = true;
                    await this.update(others[0]);
                    await super.saveDb(db);
                }
                return;
            }
        }
        console.log(`Unknown mapping: ${user.slackUserId} <-> ${user.daoWallet}`);
        return;
    }

    public async unsetCurrentFlag(db: IDatabase, slackUser: string, wallet: string): Promise<void> {
        (await this.findAllBySlackUserAndAccountNotEquals(db, slackUser, wallet))?.forEach( async (mapping: ISlackUserMapping) => {
            mapping.current = false;
            await this.update(mapping);
        });
    }

    private async findAllBySlackUserAndAccountNotEquals(db: IDatabase, slackUser: string, wallet: string): Promise<ISlackUserMapping[] | undefined> {
        return db.slackMappings.filter(mapping => 
                (mapping.slackUserId === slackUser || mapping.slackUsername === slackUser) && mapping.daoWallet != wallet
            )
    }

    private async findBySlackUserAndAccount(db: IDatabase, slackUser: string, wallet: string): Promise<ISlackUserMapping | undefined> {
        return db.slackMappings.find(mapping => 
                (mapping.slackUserId === slackUser || mapping.slackUsername === slackUser) && mapping.daoWallet === wallet
            )
    }
}

export default SlackUserMappingDao;
