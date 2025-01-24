import { MigrationInterface, QueryRunner } from "typeorm";
import MigrationHelper from "../../../helpers/MigrationHelper";

export class CreateAutoKickConfig1732973911304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Up("1732973911304-createAutoKickConfig", "3.2.4", [
            "01-AutoKickConfig-Table",
            "02-AutoKickConfig-Key",
        ], queryRunner)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        MigrationHelper.Down("1732973911304-createAutoKickConfig", "3.2.4", [
            "01-AutoKickConfig",
        ], queryRunner)
    }

}
