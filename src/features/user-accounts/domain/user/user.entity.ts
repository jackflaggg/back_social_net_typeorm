import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { loginConstraints } from '@libs/contracts/constants/user/user-property.constraints';
import { DeletionStatus, DeletionStatusType } from '@libs/contracts/enums/deletion-status.enum';
import { HydratedDocument, Model } from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import * as crypto from 'node:crypto';
import { EmailConfirmation, EmailConfirmationSchema } from './email.confirmation.shema';

@Schema({ timestamps: true })
export class UserEntity {
    @Prop({ type: String, required: true, unique: true, ...loginConstraints })
    login: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true })
    password: string;

    @Prop()
    createdAt: Date;

    @Prop({ type: EmailConfirmationSchema, required: false })
    emailConfirmation: EmailConfirmation;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    public static buildInstance(dto: any) {
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.password = dto.password;
        user.emailConfirmation = {
            confirmationCode: dto.emailConfirmation.confirmationCode,
            expirationDate: dto.emailConfirmation.expirationDate,
            isConfirmed: dto.emailConfirmation.isConfirmed,
        };
        return user as UserDocument;
    }

    makeDeleted() {
        this.login = crypto.randomUUID().slice(0, 10);
        this.email = crypto.randomUUID().slice(0, 10);
        this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
    }

    update(dto: any) {
        this.login = dto.login;
        this.email = dto.email;
    }

    public async setPasswordAdmin(password: string) {
        // Проверяем, установлен ли уже хэш пароля
        if (this.password) {
            // Если хэш уже установлен, можно вернуть текущий экземпляр
            console.log('Пароль уже установлен.');
            return this;
        }
        const salt = await genSalt(10);
        this.password = await hash(password, salt);
        return this;
    }
}

// Создает схему для сущности юзера и загружает её в базу данных
export const UserSchema = SchemaFactory.createForClass(UserEntity);

// Загружает методы из класса UserEntity в схему
UserSchema.loadClass(UserEntity);

// Определяет тип для документа юзера, который будет содержать
// свойства и методы из Mongoose, а также будет типизирован
export type UserDocument = HydratedDocument<UserEntity>;

// тип модели, которая включает в себя все методы и свойства класса
export type UserModelType = Model<UserDocument> & typeof UserEntity;
