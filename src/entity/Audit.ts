import { Column, Entity, getConnection, ManyToOne } from "typeorm";
import { AuditType } from "../constants/AuditType";
import BaseEntity from "../contracts/BaseEntity";
import StringTools from "../helpers/StringTools";
import Server from "./Server";

@Entity()
export default class Audit extends BaseEntity {
    constructor(userId: string, auditType: AuditType, reason: string, moderatorId: string) {
        super();

        this.AuditId = StringTools.RandomString(5).toUpperCase();
        this.UserId = userId;
        this.AuditType = auditType;
        this.Reason = reason;
        this.ModeratorId = moderatorId;
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

    @ManyToOne(() => Server, x => x.Audits)
    Server: Server;

    public AssignToServer(server: Server) {
        this.Server = server;
    }

    public static async FetchAuditsByUserId(userId: string): Promise<Audit[] | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(Audit);

        const all = await repository.find({ UserId: userId });

        return all;
    }

    public static async FetchAuditByAuditId(auditId: string): Promise<Audit | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(Audit);

        const single = await repository.findOne({ AuditId: auditId });

        return single;
    }
}