import { DeletionStatus, DeletionStatusType } from '../../../../../libs/contracts/enums/deletion-status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { User } from '../../../../user-accounts/domain/typeorm/user/user.entity';

// export interface CommentatorInfoInterface {
//     userId: string;
//     userLogin: string;
// }
//
// export interface likesInfoInterface {
//     likesCount: number;
//     dislikesCount: number;
// }
//
// @Entity('comments')
// export class Comments extends BaseEntity {
//     @Column({ type: 'varchar', length: 255 })
//     content: string;
//
//     // @Column({ type: { userId: 'varchar', userLogin: 'varchar' } })
//     // commentatorInfo: CommentatorInfoInterface;
//
//     @Column({ type: 'varchar' })
//     postId: string;
//
//     // @Column({ type: ExtendedLikesSchema.omit(['newestLikes', 'myStatus']), default: defaultLike })
//     // likesInfo: likesInfoInterface;
//
//     @Column({ type: 'varchar', default: DeletionStatus.enum['not-deleted'] })
//     deletionStatus: DeletionStatusType;
//
//     @ManyToOne(() => User, user => user.comments)
//     @JoinColumn({ name: 'commentatorId' })
//     user: User;
//
//     public static buildInstance(content: string, commentatorInfo: CommentatorInfoInterface, postId: string) {
//         const comment = new this();
//         comment.content = content;
//         // comment.commentatorInfo = {
//         //     userId: commentatorInfo.userId,
//         //     userLogin: commentatorInfo.userLogin,
//         // };
//         comment.postId = postId;
//         // comment.likesInfo.dislikesCount = 0;
//         // comment.likesInfo.likesCount = 0;
//         return comment;
//     }
//
//     makeDeleted() {
//         this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
//     }
//
//     updateContent(content: string) {
//         this.content = content;
//     }
//     updateStatus(likesCount: number, dislikesCount: number) {
//         // this.likesInfo.likesCount = likesCount;
//         // this.likesInfo.dislikesCount = dislikesCount;
//     }
// }
