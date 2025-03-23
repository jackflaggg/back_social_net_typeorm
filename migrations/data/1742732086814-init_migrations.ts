import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrations1742732086814 implements MigrationInterface {
    name = 'InitMigrations1742732086814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "post_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "post_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "postId" uuid NOT NULL`);
    }

}
