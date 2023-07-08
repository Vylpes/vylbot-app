import { Entity } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import AppDataSource from "../dataSources/appDataSource";

@Entity()
export default class IgnoredChannel extends BaseEntity {
    constructor(channelId: string) {
        super();

        this.Id = channelId;
    }

    public static async IsChannelIgnored(channelId: string): Promise<boolean> {
        const repository = AppDataSource.getRepository(IgnoredChannel);

        const single = await repository.findOne({ where: { Id: channelId } });

        return single != undefined;
    }
}