import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { EmailConfirmationToUser } from '../email-confirmation/email.confirmation.entity';
import { SecurityDeviceToUser } from '../device/device.entity';
import { Base } from '../../../../../core/domain/base';
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
import { UserCreateDtoRepo } from '../../../dto/repository/user.create.dto';

@Entity('users')
export class User extends Base {
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

    @OneToOne((): typeof EmailConfirmationToUser => EmailConfirmationToUser, emailConfirmation => emailConfirmation.user, { cascade: true })
    emailConfirmation: EmailConfirmationToUser;

    @OneToOne((): typeof RecoveryPasswordToUser => RecoveryPasswordToUser, recoveryConfirmation => recoveryConfirmation.user)
    recoveryConfirmation: RecoveryPasswordToUser;

    @OneToMany((): typeof SecurityDeviceToUser => SecurityDeviceToUser, securityDevice => securityDevice.user)
    securityDevices: SecurityDeviceToUser[];

    // @OneToMany((): typeof Player => Player, player => player.user)
    // players: Player[];

    static buildInstance(dto: UserCreateDtoRepo): User {
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.passwordHash = dto.password;
        user.sentEmailRegistration = dto.sentEmailRegistration;

        return user as User;
    }

    public markDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Данный объект уже был помечен на удаление');

        this.deletedAt = new Date();
    }

    public updatePassword(newPassword: string): void {
        this.passwordHash = newPassword;
    }

    public confirmedSendEmailRegistration(): void {
        this.sentEmailRegistration = true;
    }
}
