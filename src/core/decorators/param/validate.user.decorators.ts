import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserJwtPayloadDto } from '../../../features/user-accounts/strategies/refresh.strategy';

export const ExtractUserFromRequest = createParamDecorator((data: unknown, context: ExecutionContext): UserJwtPayloadDto => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
        throw new Error('В объекте запроса нет пользователя!');
    }

    return user;
});

export const ExtractAnyUserFromRequest = createParamDecorator((data: unknown, context: ExecutionContext): UserJwtPayloadDto | null => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    return user;
});
