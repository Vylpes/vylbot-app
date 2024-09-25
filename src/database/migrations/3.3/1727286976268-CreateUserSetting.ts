import { MigrationInterface, QueryRunner } from "typeorm";
import MigrationHelper from "../../../helpers/MigrationHelper";

export class CreateUserSetting1727286976268 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up('1727286976268-CreateUserSetting', '3.3.0', [
            "01-UserSetting",
        ], queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
