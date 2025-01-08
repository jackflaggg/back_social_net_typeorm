import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { loginConstraints, passwordConstraints } from '@libs/contracts/constants/user/user-property.constraints';
import { DeletionStatus, DeletionStatusType } from '@libs/contracts/enums/deletion-status.enum';
import { HydratedDocument, Model } from 'mongoose';
import { compare, genSalt, hash } from 'bcrypt';

@Schema({ timestamps: true })
export class UserEntity {
    @Prop({ type: String, required: true, unique: true, ...loginConstraints })
    login: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String, required: true /*, ...passwordConstraints */ })
    password: string;

    @Prop()
    createdAt: Date;

    @Prop({ type: String, required: true, default: DeletionStatus.enum['not-deleted'] })
    deletionStatus: DeletionStatusType;

    public static buildInstance(dto: any) {
        const user = new this();
        user.login = dto.login;
        user.email = dto.email;
        user.password = dto.password;
        return user as UserDocument;
    }

    makeDeleted() {
        this.deletionStatus = DeletionStatus.enum['permanent-deleted'];
    }

    update(dto: any) {
        this.login = dto.login;
        this.email = dto.email;
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.password = await hash(password, salt);
        return this;
    }

    public async comparePassword(pass: string, hash: string): Promise<boolean> {
        return await compare(pass, hash);
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
