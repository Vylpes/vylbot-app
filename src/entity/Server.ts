import { Column, Entity, getConnection, OneToMany } from "typeorm";
import BaseEntity from "../contracts/BaseEntity";
import Setting from "./Setting";

@Entity()
export default class Server extends BaseEntity {
    constructor(serverId: string) {
        super();

        this.Id = serverId;
    }

    @OneToMany(() => Setting, x => x.Server)
    Settings: Setting[];

    public AddSettingToServer(setting: Setting) {
        this.Settings.push(setting);
    }
}