import { DataSource } from 'typeorm';
import { typeOrmConfigOptions } from './migration.config';
import { CommentToUser } from '../../src/features/bloggers-platform/comments/domain/typeorm/comment.entity';
import { User } from '../../src/features/user-accounts/domain/typeorm/user/user.entity';
import { Post } from '../../src/features/bloggers-platform/posts/domain/typeorm/post.entity';
import { PostStatus } from '../../src/features/bloggers-platform/likes/domain/typeorm/posts/post.status.entity';
import { CommentsStatus } from '../../src/features/bloggers-platform/likes/domain/typeorm/comments/comments.status.entity';
import { Blog } from '../../src/features/bloggers-platform/blogs/domain/typeorm/blog.entity';
import { EmailConfirmationToUser } from '../../src/features/user-accounts/domain/typeorm/email-confirmation/email.confirmation.entity';
import { SecurityDeviceToUser } from '../../src/features/user-accounts/domain/typeorm/device/device.entity';
import { RecoveryPasswordToUser } from '../../src/features/user-accounts/domain/typeorm/password-recovery/pass-rec.entity';
import { join } from 'path';

export default new DataSource({
    ...typeOrmConfigOptions,
    entities: [
        // '/**/src/**/*.entity.ts',
        User,
        CommentToUser,
        Post,
        Blog,
        PostStatus,
        CommentsStatus,
        EmailConfirmationToUser,
        SecurityDeviceToUser,
        RecoveryPasswordToUser,
    ],
    migrations: [join(__dirname, '../data/*.ts')],
});
