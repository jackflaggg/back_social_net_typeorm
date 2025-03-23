import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrations1742672868324 implements MigrationInterface {
    name = 'InitMigrations1742672868324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_confirmation_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "confirmation_code" character varying(255) NOT NULL, "expiration_date" TIMESTAMP WITH TIME ZONE, "is_confirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8119912ce15961cb79a1215218c" PRIMARY KEY ("id", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "security_device_to_user" ("device_id" character varying NOT NULL, "device_name" character varying NOT NULL DEFAULT 'Google', "ip" character varying NOT NULL DEFAULT '255.255.255.255', "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, CONSTRAINT "PK_7a1cce4139feb9620bff8d44ec0" PRIMARY KEY ("device_id"))`);
        await queryRunner.query(`CREATE TABLE "recovery_password_to_user" ("user_id" uuid NOT NULL, "recovery_code" character varying, "recovery_expiration_date" TIMESTAMP WITH TIME ZONE, "used" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_65931e2851b04c42a88b7d5fb80" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(19) COLLATE "C" NOT NULL, "description" character varying(500) COLLATE "C" NOT NULL, "website_url" character varying(120) COLLATE "C" NOT NULL, "is_membership" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(30) COLLATE "C" NOT NULL, "short_description" character varying(100) COLLATE "C" NOT NULL, "content" character varying(1000) COLLATE "C" NOT NULL, "blogId" uuid NOT NULL, "blog_id" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statuses_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."statuses_posts_status_enum" NOT NULL DEFAULT 'None', "userId" uuid NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_fe2a9ce9a75a1b8253ce48ac8a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statuses_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."statuses_comments_status_enum" NOT NULL DEFAULT 'None', "userId" uuid NOT NULL, "commentId" uuid NOT NULL, CONSTRAINT "PK_c0c07c103febe814e9b5dadd112" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "login" character varying(10) COLLATE "C" NOT NULL, "email" character varying(60) COLLATE "C" NOT NULL, "password_hash" character varying(255) NOT NULL, "sent_email_registration" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "content" character varying(300) COLLATE "C" NOT NULL, "commentatorId" uuid NOT NULL, "postId" uuid NOT NULL, "commentator_id" uuid, "post_id" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" ADD CONSTRAINT "FK_980766af865924202aba719a251" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" ADD CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_7689491fe4377a8090576a799a0" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_12621b4c5c06869446dffe2424e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_e9986391e26faceeb5227fb2c33" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_596116c3b8e309206a8198604b8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_ebe9ea12883decea7e9147a1e97" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_ebe9ea12883decea7e9147a1e97"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_596116c3b8e309206a8198604b8"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_e9986391e26faceeb5227fb2c33"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_12621b4c5c06869446dffe2424e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_7689491fe4377a8090576a799a0"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP CONSTRAINT "FK_980766af865924202aba719a251"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "statuses_comments"`);
        await queryRunner.query(`DROP TABLE "statuses_posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "recovery_password_to_user"`);
        await queryRunner.query(`DROP TABLE "security_device_to_user"`);
        await queryRunner.query(`DROP TABLE "email_confirmation_to_user"`);
    }

}
