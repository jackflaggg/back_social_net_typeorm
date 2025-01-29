import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt-access') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true; // Разрешаем доступ к публичным маршрутам
        }
        return super.canActivate(context); // Для защищенных маршрутов используем стандартную логику
    }

    override handleRequest(err: any, user: any) {
        return user || null; // Возвращаем пользователя или null для анонимных пользователей
    }
}
