import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { User } from '../../../../user-accounts/domain/typeorm/user/user.entity';
import { CommentatorInfoInterface } from '../../types/commentator.info';
import { contentConstraints } from '../../../../../libs/contracts/constants/comment/comment-property.constraints';
import { isNull } from '../../../../user-accounts/utils/user/is.null';
import { Post } from '../../../posts/domain/typeorm/post.entity';

@Entity('comments')
export class CommentToUser extends BaseEntity {
    @Column({ type: 'varchar', length: contentConstraints.maxLength })
    content: string;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'commentator_id' })
    user: User;

    @ManyToOne(() => Post, post => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    public static buildInstance(content: string, commentatorInfo: CommentatorInfoInterface, postId: string) {
        const comment = new this();
        comment.content = content;
        // comment.commentatorInfo = {
        //     userId: commentatorInfo.userId,
        //     userLogin: commentatorInfo.userLogin,
        // };
        // comment.postId = postId;
        // comment.likesInfo.dislikesCount = 0;
        // comment.likesInfo.likesCount = 0;
        return comment;
    }

    makeDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Коммент уже был помечен на удаление!');
        this.deletedAt = new Date();
    }

    updateContent(content: string): void {
        this.content = content;
    }
}
