import { MigrationInterface, QueryRunner } from "typeorm"
import MigrationHelper from "../../../helpers/MigrationHelper"

export class AddServerCacheDate1709316734401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up('1709316734401-AddServerCacheDate', '3.2.1', [
            "01-Server",
        ], queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
