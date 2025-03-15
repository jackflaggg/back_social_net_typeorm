import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';

@Entity('recovery_password')
export class RecoveryPassword extends BaseEntity {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @Column({ name: 'recovery_code', nullable: true })
    recoveryCode: string;

    @Column({ name: 'recovery_expiration_date', type: 'timestamptz', nullable: true })
    recoveryExpirationDate: Date;

    @OneToOne(() => User, user => user.recoveryConfirmation)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
