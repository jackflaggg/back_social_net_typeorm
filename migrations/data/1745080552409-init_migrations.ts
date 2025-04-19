import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigrations1745080552409 implements MigrationInterface {
    name = 'InitMigrations1745080552409';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "content" character varying(300) COLLATE "C" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "content" character varying(322) COLLATE "C" NOT NULL`);
    }
}
