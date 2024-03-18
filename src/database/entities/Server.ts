import { Column, Entity, OneToMany } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import Role from "./Role";
import Setting from "./Setting";

@Entity()
export default class Server extends BaseEntity {
    constructor(serverId: string) {
        super();

        this.Id = serverId;
        this.LastCached = new Date();
    }

    @Column({ default: "2024-03-01 18:10:04" })
    LastCached: Date;

    @OneToMany(() => Setting, x => x.Server)
    Settings: Setting[];

    @OneToMany(() => Role, x => x.Server)
    Roles: Role[];

    public UpdateLastCached(lastCached: Date) {
        this.LastCached = lastCached;
    }

    public AddSettingToServer(setting: Setting) {
        this.Settings.push(setting);
    }

    public AddRoleToServer(role: Role) {
        this.Roles.push(role);
    }
}