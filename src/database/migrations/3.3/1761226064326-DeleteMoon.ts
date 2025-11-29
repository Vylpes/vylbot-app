import { MigrationInterface, QueryRunner } from "typeorm";
import MigrationHelper from "../../../helpers/MigrationHelper";

export class DeleteMoon1761226064326 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up('1761226064326-DeleteMoon', '3.3.0', [
            "01-Moon",
        ], queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Down('1761226064326-DeleteMoon', '3.3.0', [
            "01-Moon",
        ], queryRunner);
    }

}
