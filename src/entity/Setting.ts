import { Column, Entity, getConnection } from "typeorm";
import DefaultValues from "../constants/DefaultValues";
import BaseEntity from "../contracts/BaseEntity";

@Entity()
export default class Setting extends BaseEntity {
    constructor(key: string, value: string) {
        super();

        this.Key = key;
        this.Value = value;
    }

    @Column()
    Key: string;

    @Column()
    Value: string;

    public UpdateBasicDetails(key: string, value: string) {
        this.Key = key;
        this.Value = value;
    }

    public static async FetchOneByKey(key: string, relations?: string[]): Promise<Setting | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(Setting);

        const single = await repository.findOne({ Key: key }, { relations: relations || [] });

        return single;
    }

    public static async FetchValueByKeyOrDefault(key: string): Promise<string | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(Setting);

        const single = await repository.findOne({ Key: key });

        if (!single) {
            return DefaultValues.GetValue(key);
        }

        return single.Value;
    }
}