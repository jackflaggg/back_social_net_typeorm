import { Column, CreateDateColumn, Entity, OneToMany, OneToOne } from 'typeorm';
import { EmailConfirmationToUser } from '../email-confirmation/email.confirmation.entity';
import { SecurityDeviceToUser } from '../device/device.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { RecoveryPasswordToUser } from '../password-recovery/pass-rec.entity';
import { isNull } from '../../../../../core/utils/user/is.null';
import {
    emailConstraints,
    loginConstraints,
    passwordHashConstraints,
} from '../../../../../libs/contracts/constants/user/user-property.constraints';

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: loginConstraints.maxLength, unique: true, collation: 'C' })
    login: string;

    @Column({ type: 'varchar', length: emailConstraints.maxLength, unique: true, collation: 'C' })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', length: passwordHashConstraints.maxLength })
    passwordHash: string;

    // паттерн состояния
    // пока ниче сущ-го не произошло, оно в null!
    @CreateDateColumn({ name: 'updated_business_logic', type: 'timestamptz', default: null })
    updatedBusLogic: Date | null;

    @Column({ name: 'sent_email_registration', type: 'boolean', default: false })
    sentEmailRegistration: boolean;

    @OneToOne(() => EmailConfirmationToUser, emailConfirmation => emailConfirmation.user)
    emailConfirmation: EmailConfirmationToUser;

    @OneToOne(() => RecoveryPasswordToUser, recoveryConfirmation => recoveryConfirmation.user)
    recoveryConfirmation: RecoveryPasswordToUser;

    @OneToMany(() => SecurityDeviceToUser, securityDevice => securityDevice.user)
    securityDevices: SecurityDeviceToUser[];

    // создаю emailConf прям тут, чтоб покрывать агрегейшен рут,
    // если делать в разных сущностях, то это уже не агрегат ddd ?
    // User может рассматриваться как агрегатный корень, а EmailConfirmation — как часть этого агрегата.
    // Важно, чтобы доступ к EmailConfirmation происходил только через User, чтобы сохранить инкапсуляцию.
    static buildInstance(dto: any): User {
        // служит в качестве фабрики для создания экземпляров User.
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.passwordHash = dto.password;
        user.sentEmailRegistration = dto.sentEmailRegistration;

        user.createEmailConfirmation(dto.emailConfirmation);

        return user as User;
    }

    private createEmailConfirmation(dto: any): void {
        // инкапсуляция
        this.emailConfirmation = new EmailConfirmationToUser();

        this.emailConfirmation.confirmationCode = dto.confirmationCode;
        this.emailConfirmation.expirationDate = dto.expirationDate;
        this.emailConfirmation.isConfirmed = dto.isConfirmed;
    }

    private markDeleted() {
        // метод обертка!
        if (!isNull(this.deletedAt)) throw new Error('Entity already deleted');

        this.deletedAt = new Date();
        this.updatedBusLogic = new Date();
    }

    private updatePassword(newPassword: string) {
        this.passwordHash = newPassword;
        this.updatedBusLogic = new Date();
    }
}
