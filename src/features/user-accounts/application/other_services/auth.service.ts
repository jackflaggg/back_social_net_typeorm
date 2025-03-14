import { UnauthorizedDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { compare } from 'bcrypt';
import { UserPgRepository } from '../../infrastructure/postgres/user/user.pg.repository';
import { findUserByLoginOrEmailInterface } from '../../dto/api/user.in.jwt.find.dto';
import { UserLoggedInEvent } from '../user/event-handlers/logUserInformationWhenUserLoggedInEventHandler';

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

        const comparePassword: boolean = await compare(password, user.password);

        if (!comparePassword) {
            throw UnauthorizedDomainException.create();
        }
        // TODO: Перенести в юзкейс!
        // Генерация события при успешной аутентификации
        this.eventBus.publish(new UserLoggedInEvent(user.id));

        return user as findUserByLoginOrEmailInterface;
    }
}
