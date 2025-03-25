import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Base } from '../../../../../core/domain/base';
import { User } from '../../../../user-accounts/domain/typeorm/user/user.entity';
import { contentConstraints } from '../../../../../libs/contracts/constants/comment/comment-property.constraints';
import { isNull } from '../../../../user-accounts/utils/user/is.null';
import { Post } from '../../../posts/domain/typeorm/post.entity';
import { CommentsStatus } from '../../../likes/domain/typeorm/comments/comments.status.entity';

@Entity('comments')
export class CommentToUser extends Base {
    @Column({ type: 'varchar', length: contentConstraints.maxLength, collation: 'C' })
    content: string;

    @ManyToOne((): typeof User => User, user => user.comments)
    @JoinColumn({ name: 'commentator_id' })
    user: User;
    @Column({ name: 'commentator_id' })
    commentatorId: string;

    @OneToMany(() => CommentsStatus, commentsStatus => commentsStatus.comment)
    likesComments: CommentsStatus[];

    @ManyToOne((): typeof Post => Post, post => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post;
    @Column({ name: 'post_id' })
    postId: string;

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
