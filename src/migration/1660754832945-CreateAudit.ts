import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateAudit1660754832945 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE audit (Id varchar(255), WhenCreated datetime, WhenUpdated datetime, auditId varchar(255), userId varchar(255), auditType int, reason varchar(255), moderatorId varchar(255), serverId varchar(255), PRIMARY KEY (Id))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE audit`);
    }

}
