import { MigrationInterface, QueryRunner } from "typeorm"

export class migration1657647026816 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`CREATE TABLE ignored_channel (Id varchar(255), PRIMARY KEY (Id))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`DROP TABLE ignored_channel`)
    }

}
