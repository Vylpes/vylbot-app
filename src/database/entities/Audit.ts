import { Column, Entity } from "typeorm";
import { AuditType } from "../../constants/AuditType";
import BaseEntity from "../../contracts/BaseEntity";
import StringTools from "../../helpers/StringTools";
import AppDataSource from "../dataSources/appDataSource";

@Entity()
export default class Audit extends BaseEntity {
    constructor(userId: string, auditType: AuditType, reason: string, moderatorId: string, serverId: string) {
        super();

        this.AuditId = StringTools.RandomString(5).toUpperCase();
        this.UserId = userId;
        this.AuditType = auditType;
        this.Reason = reason;
        this.ModeratorId = moderatorId;
        this.ServerId = serverId;
    }

    @Column()
    AuditId: string;

    @Column()
    UserId: string;

    @Column()
    AuditType: AuditType;

    @Column()
    Reason: string;

    @Column()
    ModeratorId: string;

    @Column()
    ServerId: string;

    public static async FetchAuditsByUserId(userId: string, serverId: string): Promise<Audit[] | null> {
        const repository = AppDataSource.getRepository(Audit);

        const all = await repository.find({ where: { UserId: userId, ServerId: serverId } });

        return all;
    }

    public static async FetchAuditByAuditId(auditId: string, serverId: string): Promise<Audit | null> {
        const repository = AppDataSource.getRepository(Audit);

        const single = await repository.findOne({ where: { AuditId: auditId, ServerId: serverId } });

        return single;
    }
}