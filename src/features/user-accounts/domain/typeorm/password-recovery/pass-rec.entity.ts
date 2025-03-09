import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';

@Entity('recovery_password')
export class RecoveryPassword extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @Column({ nullable: true })
    recoveryCode: string;

    @Column({ type: 'timestamptz', nullable: true })
    recoveryExpirationDate: Date;

    @OneToOne(() => User, user => user.recoveryConfirmation)
    @JoinColumn({ name: 'userId' })
    user: User;
}
