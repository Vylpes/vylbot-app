import { Entity, OneToMany } from "typeorm";
import BaseEntity from "../contracts/BaseEntity";
import Audit from "./Audit";
import Role from "./Role";
import Setting from "./Setting";

@Entity()
export default class Server extends BaseEntity {
    constructor(serverId: string) {
        super();

        this.Id = serverId;
    }

    @OneToMany(() => Setting, x => x.Server)
    Settings: Setting[];

    @OneToMany(() => Role, x => x.Server)
    Roles: Role[];

    @OneToMany(() => Audit, x => x.Server)
    Audits: Audit[];

    public AddSettingToServer(setting: Setting) {
        this.Settings.push(setting);
    }

    public AddRoleToServer(role: Role) {
        this.Roles.push(role);
    }
}