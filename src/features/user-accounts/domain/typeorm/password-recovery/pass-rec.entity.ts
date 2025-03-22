import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('recovery_password_to_user')
export class RecoveryPasswordToUser {
    @PrimaryColumn({ name: 'user_id' })
    userId: string;

    @Column({ name: 'recovery_code', nullable: true })
    recoveryCode: string;

    @Column({ name: 'recovery_expiration_date', type: 'timestamptz', nullable: true })
    recoveryExpirationDate: Date;

    @Column({ type: Boolean, default: false })
    used: boolean;

    @OneToOne(() => User, user => user.recoveryConfirmation)
    @JoinColumn({ name: 'user_id' })
    user: User;

    static buildInstance(dto: any, userId: string) {
        const result = new RecoveryPasswordToUser();
        result.recoveryCode = dto.recoveryCode;
        result.recoveryExpirationDate = dto.recoveryExpirationDate;
        result.userId = userId;
        return result;
    }
    public updateStatus() {
        this.used = true;
    }
}
