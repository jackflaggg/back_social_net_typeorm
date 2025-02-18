import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { genSalt, hash } from 'bcrypt';
import { EmailConfirmation } from './email.confirmation.entity';
import { RecoveryPasswordEntity } from '../password-recovery/pass-rec.entity';
import { SecurityDevice } from '../device/device.entity';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20, unique: true, collation: 'C' })
    login: string;

    @Column({ type: 'varchar', length: 60, unique: true, collation: 'C' })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    passwordHash: string;

    @Column({ type: 'timestamptz', nullable: true }) // nullable: true  важно!
    deletedAt: Date | null;

    @CreateDateColumn({ type: 'timestamptz' }) // default не нужен в TypeORM
    createdAt: Date;

    @OneToOne(() => EmailConfirmation, emailConfirmation => emailConfirmation.user)
    emailConfirmation: EmailConfirmation;

    @OneToOne(() => RecoveryPasswordEntity, recoveryConfirmation => recoveryConfirmation.user)
    recoveryConfirmation: RecoveryPasswordEntity;

    @OneToMany(() => SecurityDevice, securityDevice => securityDevice.user)
    securityDevices: SecurityDevice[];

    // public static buildInstance(dto: any): User {
    //     const user = new this();
    //     user.login = dto.login;
    //     user.email = dto.email;
    //     user.passwordHash = dto.password;
    //     user.emailConfirmation = {
    //         confirmationCode: dto.emailConfirmation.confirmationCode,
    //         expirationDate: dto.emailConfirmation.expirationDate,
    //         isConfirmed: dto.emailConfirmation.isConfirmed,
    //     };
    //     return user;
    // }

    makeDeleted() {
        if (this.deletedAt) {
            throw new Error('Entity already deleted');
        }
        this.login = randomUUID().substring(0, 10);
        this.email = randomUUID().substring(0, 10);
        this.deletedAt = new Date();
    }

    public async setPasswordAdmin(password: string) {
        //Проверяем, установлен ли уже хэш пароля
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }
}
