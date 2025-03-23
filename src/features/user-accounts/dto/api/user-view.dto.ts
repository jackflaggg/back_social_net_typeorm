export interface UserIntInterface {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
}

export interface MeUserIntInterface {
    email: string;
    login: string;
    userId: string;
}

export class UserViewDto {
    id: string;
    login: string;
    email: string;
    createdAt: Date;

    constructor(model: UserIntInterface) {
        this.id = model.id;
        this.login = model.login;
        this.email = model.email;
        this.createdAt = model.createdAt;
    }

    static mapToView(user: UserIntInterface) {
        return new UserViewDto(user);
    }

    static meUser(user: MeUserIntInterface): MeUserIntInterface {
        return {
            email: user.email,
            login: user.login,
            userId: user.userId,
        };
    }
}
