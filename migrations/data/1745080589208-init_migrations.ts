import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigrations1745080589208 implements MigrationInterface {
    name = 'InitMigrations1745080589208';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "kpop"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "kpop" character varying NOT NULL`);
    }
}
