import { Column, Entity} from "typeorm";
import AppDataSource from "../dataSources/appDataSource";
import BaseEntity from "../../contracts/BaseEntity";

@Entity()
export default class UserSetting extends BaseEntity {
    constructor(userId: string, key: string, value: string) {
        super();

        this.UserId = userId;
        this.Key = key;
        this.Value = value;
    }

    @Column()
    UserId: string;

    @Column()
    Key: string;

    @Column()
    Value: string;

    public UpdateValue(value: string) {
        this.Value = value;
    }

    public static async FetchOneByKey(userId: string, key: string, relations?: string[]): Promise<UserSetting | null> {
        const repository = AppDataSource.getRepository(UserSetting);

        const single = await repository.findOne({ where: { UserId: userId, Key: key }, relations: relations || {} });

        return single;
    }
}
