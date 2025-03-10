import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../../../../../core/domain/base.entity';

@Entity('email_confirmation')
export class EmailConfirmation extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @Column({ type: 'varchar', length: 255, unique: true }) // Строгий тип для confirmationCode
    confirmationCode: string;

    @Column({ type: 'timestamptz', nullable: true }) //nullable:true
    expirationDate: Date | null;

    @Column({ type: 'boolean', default: false })
    isConfirmed: boolean;

    @OneToOne(() => User, user => user.emailConfirmation) // добавили обратную связь
    @JoinColumn({ name: 'userId' })
    user: User;
}
