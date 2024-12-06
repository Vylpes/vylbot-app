import {Column, Entity} from "typeorm";
import AppDataSource from "../dataSources/appDataSource";
import BaseEntity from "../../contracts/BaseEntity";

@Entity()
export default class AutoKickConfig extends BaseEntity {
    constructor(serverId: string, roleId: string, kickTime: number, noticeTime?: number, noticeChannelId?: string) {
        super();

        this.ServerId = serverId;
        this.RoleId = roleId;
        this.KickTime = kickTime;
        this.NoticeTime = noticeTime;
        this.NoticeChannelId = noticeChannelId;
    }

    @Column()
    ServerId: string;

    @Column()
    RoleId: string;

    @Column({ type: "int" })
    KickTime: number;

    @Column({ type: "int", nullable: true })
    NoticeTime?: number;

    @Column({ nullable: true })
    NoticeChannelId?: string;

    public UpdateBasicDetails(roleId: string, kickTime: number, noticeTime?: number, noticeChannelId?: string) {
        this.RoleId = roleId;
        this.KickTime = kickTime;
        this.NoticeTime = noticeTime;
        this.NoticeChannelId = noticeChannelId;
    }

    public static async FetchOneByServerIdAndRoleId(serverId: string, roleId: string): Promise<AutoKickConfig | null> {
        const repository = AppDataSource.getRepository(AutoKickConfig);

        const query = repository
            .createQueryBuilder("config")
            .where("config.serverId = :serverId", { serverId })
            .andWhere("config.roleId = :roleId", { roleId })
            .getOne();

        return query;
    }

    public static async FetchAllByServerId(serverId: string): Promise<AutoKickConfig[]> {
        const repository = AppDataSource.getRepository(AutoKickConfig);

        const query = repository
            .createQueryBuilder("config")
            .where("config.serverId = :serverId", { serverId })
            .getMany();

        return query;
    }
}
