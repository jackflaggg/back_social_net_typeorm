import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import crypto from 'node:crypto';
import { genSalt, hash } from 'bcrypt';

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

    @Column({ type: 'timestamptz', length: 255, nullable: true })
    deletedAt: Date;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    public static buildInstance(dto: any): User {
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.passwordHash = dto.password;
        // user.emailConfirmation = {
        //     confirmationCode: dto.emailConfirmation.confirmationCode,
        //     expirationDate: dto.emailConfirmation.expirationDate,
        //     isConfirmed: dto.emailConfirmation.isConfirmed,
        // };
        return user;
    }

    makeDeleted() {
        if (this.deletedAt) {
            throw new Error('Entity already deleted');
        }
        this.login = crypto.randomUUID().slice(0, 10);
        this.email = crypto.randomUUID().slice(0, 10);
        this.deletedAt = new Date();
    }


    public async setPasswordAdmin(password: string) {
        //Проверяем, установлен ли уже хэш пароля
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }
}