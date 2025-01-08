import { UserDocument } from '../../domain/user.entity';

export class UserViewDto {
    id: string;
    login: string;
    email: string;
    createdAt: Date;

    constructor(model: UserDocument) {
        this.id = model._id.toString();
        this.login = model.login;
        this.email = model.email;
        this.createdAt = model.createdAt;
    }

    static mapToView(blog: UserDocument): UserViewDto {
        return new UserViewDto(blog);
    }
}
