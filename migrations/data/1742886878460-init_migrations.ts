import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigrations1742886878460 implements MigrationInterface {
    name = 'InitMigrations1742886878460';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "commentatorId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "commentator_id" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "commentator_id" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "comments" ADD "commentatorId" uuid NOT NULL`);
    }
}
