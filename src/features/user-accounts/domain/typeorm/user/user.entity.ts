import { Column, CreateDateColumn, Entity, OneToMany, OneToOne } from 'typeorm';
import { EmailConfirmationToUser } from '../email-confirmation/email.confirmation.entity';
import { SecurityDeviceToUser } from '../device/device.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';
import { RecoveryPasswordToUser } from '../password-recovery/pass-rec.entity';
import { isNull } from '../../../../../core/utils/user/is.null';

@Entity('users')
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 20, unique: true, collation: 'C' })
    login: string;

    @Column({ type: 'varchar', length: 60, unique: true, collation: 'C' })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', length: 255 })
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

        user.createEmailConfirmation(dto.emailConfirmation, user.id);

        return user as User;
    }

    private createEmailConfirmation(dto: any, userId: number): void {
        // инкапсуляция
        this.emailConfirmation = new EmailConfirmationToUser();

        this.emailConfirmation.confirmationCode = dto.confirmationCode;
        this.emailConfirmation.expirationDate = dto.expirationDate;
        this.emailConfirmation.isConfirmed = dto.isConfirmed;
        this.emailConfirmation.userId = userId;
    }

    // TODO: Можно ли это считать как за то, что у меня тут бизнес логика?
    private markDeleted() {
        // метод обертка!
        if (!isNull(this.deletedAt)) {
            throw new Error('Entity already deleted');
        }

        this.deletedAt = new Date();
        this.updatedBusLogic = new Date();
    }

    private updatePassword(newPassword: string) {
        this.passwordHash = newPassword;
        this.updatedBusLogic = new Date();
    }
}
