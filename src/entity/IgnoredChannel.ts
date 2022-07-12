import { Entity, getConnection } from "typeorm";
import BaseEntity from "../contracts/BaseEntity";

@Entity()
export default class IgnoredChannel extends BaseEntity {
    constructor(channelId: string) {
        super();

        this.Id = channelId;
    }

    public static async IsChannelIgnored(channelId: string): Promise<boolean> {
        const connection = getConnection();

        const repository = connection.getRepository(IgnoredChannel);

        const single = await repository.findOne(channelId);

        return single != undefined;
    }
}