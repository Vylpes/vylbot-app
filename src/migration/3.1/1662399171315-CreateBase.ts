import { MigrationInterface, QueryRunner } from "typeorm"
import MigrationHelper from "../../helpers/MigrationHelper"

export class vylbot1662399171315 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up('1662399171315-CreateBase', '3.1', [
            "01-table/Audit",
            "01-table/IgnoredChannel",
            "01-table/Lobby",
            "01-table/Role",
            "01-table/Server",
            "01-table/Setting",

            "02-key/Audit",
            "02-key/IgnoredChannel",
            "02-key/Lobby",
            "02-key/Role",
            "02-key/Server",
            "02-key/Setting",

            "03-constraint/Role",
            "03-constraint/Setting",
        ], queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
