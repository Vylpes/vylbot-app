import { Column, Entity, getConnection, ManyToOne } from "typeorm";
import BaseEntity from "../contracts/BaseEntity";
import Server from "./Server";

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

    @ManyToOne(() => Server, x => x.Settings)
    Server: Server;

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
}