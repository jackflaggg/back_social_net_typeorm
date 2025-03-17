import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntityWithoutDeletedAt } from '../../../../../core/domain/base.entity';

@Entity('email_confirmation_to_user')
export class EmailConfirmationToUser extends BaseEntityWithoutDeletedAt {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @Column({ name: 'confirmation_code', type: 'varchar', length: 255, unique: true })
    confirmationCode: string;

    @Column({ name: 'expiration_date', type: 'timestamptz', nullable: true })
    expirationDate: Date | null;

    @Column({ name: 'is_confirmed', type: 'boolean', default: false })
    isConfirmed: boolean;

    @OneToOne(() => User, user => user.emailConfirmation)
    @JoinColumn({ name: 'user_id' })
    // добавили внешний ключ!
    user: User;

    static buildInstance(dto: any, userId: number) {
        const result = new EmailConfirmationToUser();

        result.confirmationCode = dto.confirmationCode;
        result.expirationDate = dto.expirationDate;
        result.isConfirmed = dto.isConfirmed;
        // Устанавливаем userId для связанной сущности
        result.userId = userId;
        return result as EmailConfirmationToUser;
    }

    public updateEmailConfirmation(confirmationCode: string, isConfirmed: boolean) {
        this.confirmationCode = confirmationCode;
        this.isConfirmed = isConfirmed;
    }

    public updateUserToCodeAndDate(dto: any) {
        this.confirmationCode = dto.confirmationCode;
        this.expirationDate = dto.expirationDate;
        this.isConfirmed = dto.isConfirmed;
    }
}
