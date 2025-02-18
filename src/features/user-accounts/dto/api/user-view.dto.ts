import { UserDocument } from '../../domain/user/user.entity';

export class UserViewDto {
    id: string;
    login: string;
    email: string;
    createdAt: Date;

    constructor(model: any) {
        this.id = model.id.toString();
        this.login = model.login;
        this.email = model.email;
        this.createdAt = model.createdat;
    }

    static mapToView(user: any): UserViewDto {
        return new UserViewDto(user);
    }

    static meUser(user: UserDocument) {
        return {
            email: user.email,
            login: user.login,
            userId: user._id.toString(),
        };
    }
}
