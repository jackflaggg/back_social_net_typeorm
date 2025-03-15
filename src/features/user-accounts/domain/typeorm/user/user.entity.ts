import { Column, CreateDateColumn, Entity, OneToMany, OneToOne } from 'typeorm';
import { EmailConfirmation } from '../email-confirmation/email.confirmation.entity';
import { SecurityDevice } from '../device/device.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { RecoveryPassword } from '../password-recovery/pass-rec.entity';
import { Comments } from '../../../../bloggers-platform/comments/domain/typeorm/comment.entity';
import { isNull } from '../../../../../core/utils/user/is.null';

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 20, unique: true, collation: 'C' })
    login: string;

    @Column({ type: 'varchar', length: 60, unique: true, collation: 'C' })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
    passwordHash: string;

    @CreateDateColumn({ name: 'updated_business_client', type: 'timestamptz', default: new Date() })
    updatedBusinessClient: Date;

    @Column({ name: 'sent_email_registration', type: 'boolean', default: false })
    sentEmailRegistration: boolean;

    @OneToOne(() => EmailConfirmation, emailConfirmation => emailConfirmation.user)
    emailConfirmation: EmailConfirmation;

    @OneToOne(() => RecoveryPassword, recoveryConfirmation => recoveryConfirmation.user)
    recoveryConfirmation: RecoveryPassword;

    @OneToMany(() => SecurityDevice, securityDevice => securityDevice.user)
    securityDevices: SecurityDevice[];

    @OneToMany(() => Comments, comments => comments.user)
    comments: Comments[];

    // @OneToMany(() => likesComments, comments => comments.user)
    // statusesComment: likesComments[];

    // @OneToMany(() => likesPosts, posts => posts.user)
    // statusesPost: likesPosts[];

    static buildInstance(login: string, email: string, passwordHash: string): User {
        const user = new this();
        user.login = login;
        user.email = email;
        user.passwordHash = passwordHash;
        return user as User;
    }

    markDeleted() {
        if (!isNull(this.deletedAt)) {
            throw new Error('Entity already deleted');
        }

        this.deletedAt = new Date();
    }

    updatePassword(newPasswordHash: string) {
        this.passwordHash = newPasswordHash;
    }
}
