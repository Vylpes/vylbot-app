import { Column, Entity, getConnection, ManyToOne } from "typeorm";
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

    public SetServer(server: Server) {
        this.Server = server;
    }

    public static async FetchOneByRoleId(roleId: string, relations?: string[]): Promise<Role | null> {
        const connection = getConnection();

        const repository = connection.getRepository(Role);

        const single = await repository.findOne({ where: { RoleId: roleId }, relations: relations || []});

        return single;
    }

    public static async FetchAllByServerId(serverId: string): Promise<Role[]> {
        const connection = getConnection();

        const repository = connection.getRepository(Server);

        const all = await repository.findOne({ where: { Id: serverId }, relations: [
            "Roles",
        ] });

        if (!all) {
            return [];
        }

        return all.Roles;
    }
}