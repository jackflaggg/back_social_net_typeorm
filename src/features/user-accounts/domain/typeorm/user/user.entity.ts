import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { EmailConfirmationToUser } from '../email-confirmation/email.confirmation.entity';
import { SecurityDeviceToUser } from '../device/device.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { RecoveryPasswordToUser } from '../password-recovery/pass-rec.entity';
import {
    emailConstraints,
    loginConstraints,
    passwordHashConstraints,
} from '../../../../../libs/contracts/constants/user/user-property.constraints';
import { isNull } from '../../../utils/user/is.null';
import { CommentToUser } from '../../../../bloggers-platform/comments/domain/typeorm/comment.entity';
import { PostStatus } from '../../../../bloggers-platform/likes/domain/typeorm/posts/post.status.entity';
import { CommentsStatus } from '../../../../bloggers-platform/likes/domain/typeorm/comments/comments.status.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: loginConstraints.maxLength, unique: true, collation: 'C' })
    login: string;

    @Column({ type: 'varchar', length: emailConstraints.maxLength, unique: true, collation: 'C' })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', length: passwordHashConstraints.maxLength })
    passwordHash: string;

    @Column({ name: 'sent_email_registration', type: 'boolean', default: false })
    sentEmailRegistration: boolean;

    @OneToMany((): typeof PostStatus => PostStatus, postStatus => postStatus.status, { cascade: false })
    likesPosts: PostStatus[];

    @OneToMany((): typeof CommentsStatus => CommentsStatus, commentsStatus => commentsStatus.user, { cascade: false })
    likesComments: CommentsStatus[];

    @OneToMany((): typeof CommentToUser => CommentToUser, comment => comment.user)
    comments: CommentToUser[];

    @OneToOne(() => EmailConfirmationToUser, emailConfirmation => emailConfirmation.user, { cascade: true })
    emailConfirmation: EmailConfirmationToUser;

    @OneToOne(() => RecoveryPasswordToUser, recoveryConfirmation => recoveryConfirmation.user)
    recoveryConfirmation: RecoveryPasswordToUser;

    @OneToMany(() => SecurityDeviceToUser, securityDevice => securityDevice.user)
    securityDevices: SecurityDeviceToUser[];

    static buildInstance(dto: { login: string; email: string; password: string; sentEmailRegistration: boolean }): User {
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.passwordHash = dto.password;
        user.sentEmailRegistration = dto.sentEmailRegistration;

        // TODO: Переведи на агрегейшен рут
        //user.emailConfirmation = new EmailConfirmationToUser();
        return user as User;
    }

    public markDeleted() {
        if (!isNull(this.deletedAt)) throw new Error('Данный объект уже был помечен на удаление');

        this.deletedAt = new Date();
    }

    public updatePassword(newPassword: string) {
        this.passwordHash = newPassword;
    }

    public confirmedSendEmailRegistration() {
        this.sentEmailRegistration = true;
    }
}
