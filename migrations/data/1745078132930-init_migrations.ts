import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigrations1745078132930 implements MigrationInterface {
    name = 'InitMigrations1745078132930';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445" PRIMARY KEY ("id")`,
        );
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "UQ_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(
            ` ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "UQ_56925ba65f907e81ba65d5e0ef4" UNIQUE ("user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP CONSTRAINT "FK_980766af865924202aba719a251"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP CONSTRAINT "PK_65931e2851b04c42a88b7d5fb80"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "recovery_password_to_user" ADD CONSTRAINT "PK_65931e2851b04c42a88b7d5fb80" PRIMARY KEY ("user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_7689491fe4377a8090576a799a0"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "PK_e113335f11c926da929a625f118"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_2f1766fc58682e063dca2ea083f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "blog_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "blog_id" uuid`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_dc0d5708f132ee4ef728142dd28"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_93326313ce6f6eb74132155974c"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_2f1766fc58682e063dca2ea083f" PRIMARY KEY ("post_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_2f1766fc58682e063dca2ea083f"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_93326313ce6f6eb74132155974c" PRIMARY KEY ("post_id", "user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_93326313ce6f6eb74132155974c"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_dc0d5708f132ee4ef728142dd28" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "post_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_dc0d5708f132ee4ef728142dd28"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_93326313ce6f6eb74132155974c" PRIMARY KEY ("user_id", "post_id")`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_fe01421e38adaed05a59d27a32e"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_8834340f5199d3dc06b6d0ec9a1"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_8834340f5199d3dc06b6d0ec9a1" PRIMARY KEY ("comment_id")`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_8834340f5199d3dc06b6d0ec9a1"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd" PRIMARY KEY ("comment_id", "user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_fe01421e38adaed05a59d27a32e" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "comment_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "comment_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_fe01421e38adaed05a59d27a32e"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd" PRIMARY KEY ("user_id", "comment_id")`,
        );
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "commentator_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "commentator_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "post_id" uuid NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "security_device_to_user" ADD CONSTRAINT "FK_980766af865924202aba719a251" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "recovery_password_to_user" ADD CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_7689491fe4377a8090576a799a0" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_dc0d5708f132ee4ef728142dd28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_2f1766fc58682e063dca2ea083f" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_fe01421e38adaed05a59d27a32e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_8834340f5199d3dc06b6d0ec9a1" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
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
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "post_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "commentator_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "commentator_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_fe01421e38adaed05a59d27a32e" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "comment_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "comment_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_fe01421e38adaed05a59d27a32e"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd" PRIMARY KEY ("comment_id", "user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_8834340f5199d3dc06b6d0ec9a1" PRIMARY KEY ("comment_id")`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "PK_8834340f5199d3dc06b6d0ec9a1"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "PK_330021be0b6ea9ec4cce88cd8cd" PRIMARY KEY ("user_id", "comment_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_8834340f5199d3dc06b6d0ec9a1" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_fe01421e38adaed05a59d27a32e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_93326313ce6f6eb74132155974c"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_dc0d5708f132ee4ef728142dd28" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "post_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_dc0d5708f132ee4ef728142dd28"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_93326313ce6f6eb74132155974c" PRIMARY KEY ("post_id", "user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_93326313ce6f6eb74132155974c"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_2f1766fc58682e063dca2ea083f" PRIMARY KEY ("post_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "PK_2f1766fc58682e063dca2ea083f"`);
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "PK_93326313ce6f6eb74132155974c" PRIMARY KEY ("user_id", "post_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_dc0d5708f132ee4ef728142dd28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "blog_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "blog_id" integer`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")`);
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_2f1766fc58682e063dca2ea083f" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "PK_e113335f11c926da929a625f118"`);
        await queryRunner.query(`ALTER TABLE "blogs" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blogs" ADD CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id")`);
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_7689491fe4377a8090576a799a0" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP CONSTRAINT "PK_65931e2851b04c42a88b7d5fb80"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "recovery_password_to_user" ADD CONSTRAINT "PK_65931e2851b04c42a88b7d5fb80" PRIMARY KEY ("user_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "recovery_password_to_user" ADD CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "security_device_to_user" ADD CONSTRAINT "FK_980766af865924202aba719a251" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "UQ_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "UQ_56925ba65f907e81ba65d5e0ef4" UNIQUE ("user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445" PRIMARY KEY ("id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
