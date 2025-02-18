import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailConfirmation } from './email.confirmation.entity';
import { RecoveryPassword } from '../password-recovery/pass-rec.entity';
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

    @OneToOne(() => RecoveryPassword, recoveryConfirmation => recoveryConfirmation.user)
    recoveryConfirmation: RecoveryPassword;

    @OneToMany(() => SecurityDevice, securityDevice => securityDevice.user)
    securityDevices: SecurityDevice[];
}
