export interface UserIntInterface {
    id: number | string;
    login: string;
    email: string;
    createdat: Date;
}

export interface MeUserIntInterface {
    email: string;
    login: string;
    userId: string;
}

export class UserViewDto {
    id: number | string;
    login: string;
    email: string;
    createdAt: Date;

    constructor(model: UserIntInterface) {
        this.id = String(model.id);
        this.login = model.login;
        this.email = model.email;
        this.createdAt = model.createdat;
    }

    static mapToView(user: UserIntInterface) {
        return new UserViewDto(user);
    }

    static meUser(user: MeUserIntInterface): MeUserIntInterface {
        return {
            email: user.email,
            login: user.login,
            userId: String(user.userId),
        };
    }
}
