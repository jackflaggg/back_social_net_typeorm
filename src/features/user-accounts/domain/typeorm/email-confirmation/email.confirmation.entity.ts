import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntityWithoutDeletedAt } from '../../../../../core/domain/base';
import { emailConfirmationCreateDto } from '../../../dto/repository/em-conf.create.dto';
import { EmailConfirmationUpdateDto } from '../../../dto/repository/em-conf.update.dto';

@Entity('email_confirmation_to_user')
export class EmailConfirmationToUser extends BaseEntityWithoutDeletedAt {
    @Column({ name: 'confirmation_code', type: 'varchar', length: 255 })
    confirmationCode: string;

    @Column({ name: 'expiration_date', type: 'timestamptz', nullable: true })
    expirationDate: Date | null;

    @Column({ name: 'is_confirmed', type: 'boolean', default: false })
    isConfirmed: boolean;

    @OneToOne(() => User, user => user.emailConfirmation)
    @JoinColumn({ name: 'user_id' })
    user: User;
    @Column({ name: 'user_id' })
    userId: number;

    static buildInstance(dto: emailConfirmationCreateDto, userId: number): EmailConfirmationToUser {
        const result = new EmailConfirmationToUser();

        result.confirmationCode = dto.confirmationCode;
        result.expirationDate = dto.expirationDate;
        result.isConfirmed = dto.isConfirmed;
        // Устанавливаем userId для связанной сущности
        result.userId = userId;
        return result as EmailConfirmationToUser;
    }

    public updateCodeAndConfirmed(confirmationCode: string, isConfirmed: boolean): void {
        this.confirmationCode = confirmationCode;
        this.isConfirmed = isConfirmed;
    }

    public updateUserToCodeAndDate(dto: EmailConfirmationUpdateDto) {
        this.confirmationCode = dto.confirmationCode;
        this.expirationDate = dto.expirationDate;
        this.isConfirmed = dto.isConfirmed;
    }
}
