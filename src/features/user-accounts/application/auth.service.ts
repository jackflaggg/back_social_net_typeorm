import { BadRequestDomainException, UnauthorizedDomainException } from '../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { compare } from 'bcrypt';
import { UserPgRepository } from '../infrastructure/postgres/user/user.pg.repository';
import { findUserByLoginOrEmailInterface } from '../dto/api/user.in.jwt.find.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserLoggedInEvent } from '../event-bus/auth/user.logged.event';
import { UserRegistrationEvent } from '../event-bus/auth/user.registration.event';

@Injectable()
export class AuthService {
    constructor(
        @Inject() private readonly usersRepository: UserPgRepository,
        private readonly eventBus: EventBus, // Внедрение EventBus
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async validateUser(userName: string, password: string): Promise<findUserByLoginOrEmailInterface> {
        const user = await this.usersRepository.findUserByLoginOrEmail(userName);
        if (!user) {
            throw UnauthorizedDomainException.create();
        }

        const comparePassword: boolean = await compare(password, user.password);
        if (!comparePassword) {
            throw UnauthorizedDomainException.create();
        }
        // Генерация события при успешной аутентификации
        this.eventBus.publish(new UserLoggedInEvent(user.id));

        // Проверка работы eventEmitter
        this.eventEmitter.emit('login-user', user.id);

        return user as findUserByLoginOrEmailInterface;
    }

    async uniqueUser(login: string) {
        const result = await this.usersRepository.findUserLogin(login);

        if (result) {
            throw BadRequestDomainException.create('поля должны быть уникальными!', 'login');
        }

        this.eventBus.publish(new UserRegistrationEvent(!result));

        return !result;
    }
}
