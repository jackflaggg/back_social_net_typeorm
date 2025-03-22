import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigrations1742666932464 implements MigrationInterface {
    name = 'InitMigrations1742666932464';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_dc0d5708f132ee4ef728142dd28"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_2f1766fc58682e063dca2ea083f"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_fe01421e38adaed05a59d27a32e"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_8834340f5199d3dc06b6d0ec9a1"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "REL_dc0d5708f132ee4ef728142dd2"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "REL_2f1766fc58682e063dca2ea083"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "REL_fe01421e38adaed05a59d27a32"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "REL_8834340f5199d3dc06b6d0ec9a"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "comment_id"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "postId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "blogId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "commentId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "commentatorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "postId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "PK_8119912ce15961cb79a1215218c"`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445" PRIMARY KEY ("id")`,
        );
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445"`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "PK_8119912ce15961cb79a1215218c" PRIMARY KEY ("id", "user_id")`,
        );
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP CONSTRAINT "FK_980766af865924202aba719a251"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" ADD "user_id" uuid`);
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
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "blog_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "blog_id" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "commentator_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "commentator_id" uuid`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "post_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
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
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_12621b4c5c06869446dffe2424e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_e9986391e26faceeb5227fb2c33" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_7689491fe4377a8090576a799a0" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_596116c3b8e309206a8198604b8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_ebe9ea12883decea7e9147a1e97" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_ebe9ea12883decea7e9147a1e97"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP CONSTRAINT "FK_596116c3b8e309206a8198604b8"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_7689491fe4377a8090576a799a0"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_e9986391e26faceeb5227fb2c33"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP CONSTRAINT "FK_12621b4c5c06869446dffe2424e"`);
        await queryRunner.query(`ALTER TABLE "recovery_password_to_user" DROP CONSTRAINT "FK_65931e2851b04c42a88b7d5fb80"`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP CONSTRAINT "FK_980766af865924202aba719a251"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "post_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "post_id" integer`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "commentator_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "commentator_id" integer`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")`);
        await queryRunner.query(
            `ALTER TABLE "comments" ADD CONSTRAINT "FK_fb5d5067e0da123829fd7c91c64" FOREIGN KEY ("commentator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
        await queryRunner.query(`ALTER TABLE "security_device_to_user" ADD "user_id" integer`);
        await queryRunner.query(
            `ALTER TABLE "security_device_to_user" ADD CONSTRAINT "FK_980766af865924202aba719a251" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "PK_8119912ce15961cb79a1215218c"`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445" PRIMARY KEY ("id")`,
        );
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445"`);
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "PK_8119912ce15961cb79a1215218c" PRIMARY KEY ("id", "user_id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "commentatorId"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "blogId"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "comment_id" integer`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "REL_8834340f5199d3dc06b6d0ec9a" UNIQUE ("comment_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "statuses_comments" ADD CONSTRAINT "REL_fe01421e38adaed05a59d27a32" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "post_id" integer`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "REL_2f1766fc58682e063dca2ea083" UNIQUE ("post_id")`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "statuses_posts" ADD CONSTRAINT "REL_dc0d5708f132ee4ef728142dd2" UNIQUE ("user_id")`);
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_8834340f5199d3dc06b6d0ec9a1" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_comments" ADD CONSTRAINT "FK_fe01421e38adaed05a59d27a32e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_2f1766fc58682e063dca2ea083f" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "statuses_posts" ADD CONSTRAINT "FK_dc0d5708f132ee4ef728142dd28" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
