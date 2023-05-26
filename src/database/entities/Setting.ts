import { Column, Entity, ManyToOne } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import Server from "./Server";
import AppDataSource from "../dataSources/appDataSource";

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

    public static async FetchOneByKey(key: string, relations?: string[]): Promise<Setting | null> {
        const repository = AppDataSource.getRepository(Setting);

        const single = await repository.findOne({ where: { Key: key }, relations: relations || {} });

        return single;
    }
}