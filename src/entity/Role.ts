import { Column, Entity, EntityTarget, getConnection, ManyToOne } from "typeorm";
import BaseEntity from "../contracts/BaseEntity"
import Server from "./Server";

@Entity()
export default class Role extends BaseEntity {
    constructor(roleId: string) {
        super();

        this.RoleId = roleId;
    }

    @Column()
    RoleId: string;

    @ManyToOne(() => Server, x => x.Roles)
    Server: Server;

    public static async FetchOneByServerId(serverId: string, roleId: string): Promise<Role | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(Server);

        const single = await repository.findOne(serverId, { relations: [
            "Roles",
        ]});

        if (!single) return undefined;

        const search = single.Roles.find(x => x.Id == roleId);

        return search;
    }
}