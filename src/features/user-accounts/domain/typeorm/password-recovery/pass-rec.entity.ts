import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('RecoveryPassword')
export class RecoveryPassword {
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
