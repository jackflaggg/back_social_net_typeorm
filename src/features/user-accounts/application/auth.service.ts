import { BadRequestDomainException, UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from '../domain/user/user.entity';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRepository } from '../infrastructure/user/user.repository';
import { compare } from 'bcrypt';

export class UserLoggedInEvent {
    constructor(public readonly userId: string) {}
}

@Injectable()
export class AuthService {
    constructor(
        @Inject() private readonly usersRepository: UserRepository,
        private readonly eventBus: EventBus, // Внедрение EventBus
    ) {}

    async validateUser(userName: string, password: string) {
        const user = await this.usersRepository.findUserByLoginOrEmail(userName);
        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        const comparePassword = await compare(password, user.password);
        if (!comparePassword) {
            throw UnauthorizedDomainException.create();
        }
        // Генерация события при успешной аутентификации
        this.eventBus.publish(new UserLoggedInEvent(user._id.toString()));

        return user;
    }
    async uniqueLoginUser(login: string) {
        const one = await this.usersRepository.findUserByLoginOrEmail(login);

        if (one) {
            throw BadRequestDomainException.create('поля должны быть уникальными!', 'login');
        }
        return !one;
    }

    async uniqueEmailUser(email: string) {
        const one = await this.usersRepository.findUserByLoginOrEmail(email);

        if (one) {
            throw BadRequestDomainException.create('поля должны быть уникальными!', 'email');
        }
        return !one;
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
