import { UserDocument } from '../../domain/user/user.entity';

export class UserViewDto {
    id: number | string;
    login: string;
    email: string;
    createdAt: Date;

    constructor(model: any) {
        this.id = model.id.toString();
        this.login = model.login;
        this.email = model.email;
        this.createdAt = model.createdAt;
    }

    static mapToView(user: any): UserViewDto {
        return new UserViewDto(user);
    }

    static meUser(user: { email: string; login: string; userId: string }) {
        return {
            email: user.email,
            login: user.login,
            userId: String(user.userId),
        };
    }
}
