import { Column, Entity, ManyToOne } from "typeorm";
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
}