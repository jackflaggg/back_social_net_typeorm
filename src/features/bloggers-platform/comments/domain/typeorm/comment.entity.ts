import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { User } from '../../../../user-accounts/domain/typeorm/user/user.entity';
import { contentConstraints } from '../../../../../libs/contracts/constants/comment/comment-property.constraints';
import { isNull } from '../../../../user-accounts/utils/user/is.null';
import { Post } from '../../../posts/domain/typeorm/post.entity';
import { CommentsStatus } from '../../../likes/domain/typeorm/comments/comments.status.entity';

@Entity('comments')
export class CommentToUser extends BaseEntity {
    @Column({ type: 'varchar', length: contentConstraints.maxLength })
    content: string;

    @Column({ type: 'uuid' })
    commentatorId: string;

    @Column({ type: 'uuid' })
    postId: string;

    @ManyToOne((): typeof User => User, user => user.comments)
    @JoinColumn({ name: 'commentator_id' })
    user: User;

    @OneToMany(() => CommentsStatus, commentsStatus => commentsStatus.comment)
    likesComments: CommentsStatus[];

    @ManyToOne((): typeof Post => Post, post => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    public static buildInstance(content: string, userId: string, postId: string): CommentToUser {
        const comment = new this();
        comment.content = content;
        comment.commentatorId = userId;
        comment.postId = postId;
        return comment as CommentToUser;
    }

    makeDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Коммент уже был помечен на удаление!');
        this.deletedAt = new Date();
    }

    updateContent(content: string): void {
        this.content = content;
    }
}
