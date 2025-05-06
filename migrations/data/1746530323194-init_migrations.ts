import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrations1746530323194 implements MigrationInterface {
    name = 'InitMigrations1746530323194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_confirmation_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "confirmation_code" character varying(255) NOT NULL, "expiration_date" TIMESTAMP WITH TIME ZONE, "is_confirmed" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_56925ba65f907e81ba65d5e0ef" UNIQUE ("user_id"), CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "security_device_to_user" ("device_id" character varying NOT NULL, "device_name" character varying NOT NULL DEFAULT 'Google', "ip" character varying NOT NULL DEFAULT '255.255.255.255', "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "PK_7a1cce4139feb9620bff8d44ec0" PRIMARY KEY ("device_id"))`);
        await queryRunner.query(`CREATE TABLE "recovery_password_to_user" ("user_id" uuid NOT NULL, "recovery_code" character varying, "recovery_expiration_date" TIMESTAMP WITH TIME ZONE, "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_65931e2851b04c42a88b7d5fb80" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(19) COLLATE "C" NOT NULL, "description" character varying(500) COLLATE "C" NOT NULL, "website_url" character varying(120) COLLATE "C" NOT NULL, "is_membership" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_281ab550ec0a4b9adbd1b55a02" ON "blogs" ("deleted_at") `);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(30) COLLATE "C" NOT NULL, "short_description" character varying(100) COLLATE "C" NOT NULL, "content" character varying(1000) COLLATE "C" NOT NULL, "blog_id" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_61923840677a3e5f58de79b816" ON "posts" ("deleted_at") `);
        await queryRunner.query(`CREATE TYPE "public"."statuses_posts_status_enum" AS ENUM('None', 'Like', 'Dislike')`);
        await queryRunner.query(`CREATE TABLE "statuses_posts" ("user_id" uuid NOT NULL, "post_id" uuid NOT NULL, "status" "public"."statuses_posts_status_enum" NOT NULL DEFAULT 'None', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93326313ce6f6eb74132155974c" PRIMARY KEY ("user_id", "post_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."statuses_comments_status_enum" AS ENUM('None', 'Like', 'Dislike')`);
        await queryRunner.query(`CREATE TABLE "statuses_comments" ("user_id" uuid NOT NULL, "comment_id" uuid NOT NULL, "status" "public"."statuses_comments_status_enum" NOT NULL DEFAULT 'None', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd" PRIMARY KEY ("user_id", "comment_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "login" character varying(10) COLLATE "C" NOT NULL, "email" character varying(60) COLLATE "C" NOT NULL, "password_hash" character varying(255) NOT NULL, "sent_email_registration" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_073999dfec9d14522f0cf58cd6" ON "users" ("deleted_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "content" character varying(300) COLLATE "C" NOT NULL, "commentator_id" uuid NOT NULL, "post_id" uuid NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b6f97e2e112b5d7bad003655b7" ON "comments" ("deleted_at") `);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" ADD CONSTRAINT "FK_980766af865924202aba719a251" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" ADD CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_7689491fe4377a8090576a799a0" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_dc0d5708f132ee4ef728142dd28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_2f1766fc58682e063dca2ea083f" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_fe01421e38adaed05a59d27a32e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_8834340f5199d3dc06b6d0ec9a1" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_8834340f5199d3dc06b6d0ec9a1"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_fe01421e38adaed05a59d27a32e"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_2f1766fc58682e063dca2ea083f"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_dc0d5708f132ee4ef728142dd28"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_7689491fe4377a8090576a799a0"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP CONSTRAINT "FK_980766af865924202aba719a251"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6f97e2e112b5d7bad003655b7"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_073999dfec9d14522f0cf58cd6"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "statuses_comments"`);
        await queryRunner.query(`DROP TYPE "public"."statuses_comments_status_enum"`);
        await queryRunner.query(`DROP TABLE "statuses_posts"`);
        await queryRunner.query(`DROP TYPE "public"."statuses_posts_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61923840677a3e5f58de79b816"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_281ab550ec0a4b9adbd1b55a02"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "recovery_password_to_user"`);
        await queryRunner.query(`DROP TABLE "security_device_to_user"`);
        await queryRunner.query(`DROP TABLE "email_confirmation_to_user"`);
    }

}
