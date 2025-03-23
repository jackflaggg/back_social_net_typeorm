import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrations1742673882305 implements MigrationInterface {
    name = 'InitMigrations1742673882305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" ADD "is_mock" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "is_mock"`);
    }

}
