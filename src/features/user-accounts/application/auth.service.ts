import { BadRequestDomainException, UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { compare } from 'bcrypt';
import { UserPgRepository } from '../infrastructure/postgres/user/user.pg.repository';
import { findUserByLoginOrEmailInterface } from './user/usecases/login-user.usecase';

export class UserLoggedInEvent {
    constructor(public readonly userId: string) {}
}

@Injectable()
export class AuthService {
    constructor(
        @Inject() private readonly usersRepository: UserPgRepository,
        private readonly eventBus: EventBus, // Внедрение EventBus
    ) {}

    async validateUser(userName: string, password: string): Promise<findUserByLoginOrEmailInterface> {
        const user = await this.usersRepository.findUserByLoginOrEmail(userName);
        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        const comparePassword = await compare(password, user.password);
        if (!comparePassword) {
            throw UnauthorizedDomainException.create();
        }
        // Генерация события при успешной аутентификации
        this.eventBus.publish(new UserLoggedInEvent(user.id));

        return user as findUserByLoginOrEmailInterface;
    }
    async uniqueLoginUser(login: string) {
        const result = await this.usersRepository.findUserByLoginOrEmail(login);

        if (result) {
            throw BadRequestDomainException.create('поля должны быть уникальными!', 'login');
        }
        return !result;
    }

    async uniqueEmailUser(email: string) {
        const result = await this.usersRepository.findUserByLoginOrEmail(email);

        if (result) {
            throw BadRequestDomainException.create('поля должны быть уникальными!', 'email');
        }
        return !result;
    }
}

@EventsHandler(UserLoggedInEvent)
export class UserLoggedInEventHandler implements IEventHandler<UserLoggedInEvent> {
    handle(event: UserLoggedInEvent) {
        console.log(`User ${event.userId} has logged in.`);
        // Здесь вы можете выполнить дополнительные действия, такие как логирование,
        // обновление статистики, отправка уведомлений и т.д.
    }
}
