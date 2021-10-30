import jsonfile from 'jsonfile';
import { IUser } from '../../entities/User';
import { ISlackUserMapping } from '../../entities/SlackUserMapping';


interface IDatabase {
    users: IUser[];
    slackMappings: ISlackUserMapping[];
}


class MockDaoMock {

    private readonly dbFilePath = 'src/daos/MockDb/MockDb.json';


    protected openDb(): Promise<IDatabase> {
        return jsonfile.readFile(this.dbFilePath) as Promise<IDatabase>;
    }


    protected saveDb(db: IDatabase): Promise<void> {
        return jsonfile.writeFile(this.dbFilePath, db, {spaces: 2});
    }
}

export default MockDaoMock;
