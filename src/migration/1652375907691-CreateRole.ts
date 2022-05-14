import { MigrationInterface, QueryRunner } from "typeorm"

export class migration1652375907691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE role (Id varchar(255), WhenCreated datetime, WhenUpdated datetime, RoleId varchar(255), serverId varchar(255), PRIMARY KEY (Id), FOREIGN KEY (serverId) REFERENCES server(Id))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE role`);
    }

}
