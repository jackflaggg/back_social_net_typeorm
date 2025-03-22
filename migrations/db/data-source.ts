import { DataSource } from 'typeorm';
import { typeOrmConfigOptions } from './migration.config';
import { User } from '../../src/features/user-accounts/domain/typeorm/user/user.entity';
import { PostStatus } from '../../src/features/bloggers-platform/likes/domain/typeorm/posts/post.status.entity';
import { CommentsStatus } from '../../src/features/bloggers-platform/likes/domain/typeorm/comments/comments.status.entity';
import { EmailConfirmationToUser } from '../../src/features/user-accounts/domain/typeorm/email-confirmation/email.confirmation.entity';
import { RecoveryPasswordToUser } from '../../src/features/user-accounts/domain/typeorm/password-recovery/pass-rec.entity';
import { CommentToUser } from '../../src/features/bloggers-platform/comments/domain/typeorm/comment.entity';
import { Blog } from '../../src/features/bloggers-platform/blogs/domain/typeorm/blog.entity';
import { Post } from '../../src/features/bloggers-platform/posts/domain/typeorm/post.entity';
import { SecurityDeviceToUser } from '../../src/features/user-accounts/domain/typeorm/device/device.entity';

/*
    упрощает импорт, подчеркивает уникальность экземпляра,
    улучшает ясность назначения файла, предоставляет единую точку конфигурации
    и обеспечивает совместимость с TypeORM.
 */

export default new DataSource({
    ...typeOrmConfigOptions,
    entities: [
        User,
        PostStatus,
        CommentsStatus,
        EmailConfirmationToUser,
        RecoveryPasswordToUser,
        Post,
        Blog,
        CommentToUser,
        SecurityDeviceToUser,
    ],
    migrations: [__dirname + 'data/**/*.ts'],
});
