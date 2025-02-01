import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserQueryRepository } from '../infrastructure/user/query/user.query.repository';
import { AuthLoginDtoApi } from '../dto/api/auth.login.dto';
import { AuthPasswordRecoveryDtoApi } from '../dto/api/auth.password-recovery.dto';
import { AuthNewPasswordDtoApi } from '../dto/api/auth.new-password.dto';
import { AuthRegistrationDtoApi } from '../dto/api/auth.registration.dto';
import { AuthRegistrationConfirmationDtoApi } from '../dto/api/auth.registration-confirmation.dto';
import { AuthRegistrationEmailResendingDtoApi } from '../dto/api/auth.registration-email-resending.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { LocalAuthGuard } from '../../../core/guards/passport/guards/local.auth.guard';
import { JwtAuthGuard } from '../../../core/guards/passport/guards/jwt.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../application/user/usecases/login-user.usecase';
import { RegistrationUserCommand } from '../application/user/usecases/registration-user.usecase';
import { UniqueEmailAuthGuard, UniqueLoginAuthGuard } from '../../../core/guards/passport/guards/uniqueLoginAuthGuard';
import { RegistrationConfirmationUserCommand } from '../application/user/usecases/registration-confirmation-user.usecase';
import { PasswordRecoveryUserCommand } from '../application/user/usecases/password-recovery-user.usecase';
import { RegistrationEmailResendUserCommand } from '../application/user/usecases/registration-email-resend-user.usecase';
import { NewPasswordUserCommand } from '../application/user/usecases/new-password-user.usecase';
import { RefreshAuthGuard } from '../../../core/guards/passport/guards/refresh.auth.guard';
import { ExtractAnyUserFromRequest } from '../../../core/decorators/param/validate.user.decorators';
import { UserJwtPayloadDto } from '../../../core/guards/passport/strategies/refresh.strategy';
import { RefreshTokenUserCommand } from '../application/user/usecases/refresh-token.user.usecase';
import { LogoutUserCommand } from '../application/user/usecases/logout-user.usecase';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepository: UserQueryRepository,
    ) {}
    @HttpCode(HttpStatus.OK)
    @UseGuards(ThrottlerGuard, LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() dto: AuthLoginDtoApi) {
        const { jwt, refresh } = await this.commandBus.execute(new LoginUserCommand(req.ip, req.headers['user-agent'], req.user));
        res.cookie('refreshToken', refresh, { httpOnly: true, secure: true });
        return {
            accessToken: jwt,
        };
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    @Post('password-recovery')
    async passwordRecovery(@Body() dto: AuthPasswordRecoveryDtoApi) {
        return this.commandBus.execute(new PasswordRecoveryUserCommand(dto.email));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    @Post('new-password')
    async newPassword(@Body() dto: AuthNewPasswordDtoApi) {
        return this.commandBus.execute(new NewPasswordUserCommand(dto.newPassword, dto.recoveryCode));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard, UniqueEmailAuthGuard, UniqueLoginAuthGuard)
    @Post('registration')
    async registration(@Body() dto: AuthRegistrationDtoApi) {
        return this.commandBus.execute(new RegistrationUserCommand(dto));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() dto: AuthRegistrationConfirmationDtoApi) {
        return this.commandBus.execute(new RegistrationConfirmationUserCommand(dto.code));
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(ThrottlerGuard)
    @Post('registration-email-resending')
    async registrationEmailResend(@Body() dto: AuthRegistrationEmailResendingDtoApi) {
        return this.commandBus.execute(new RegistrationEmailResendUserCommand(dto.email));
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@ExtractAnyUserFromRequest() payload: UserJwtPayloadDto) {
        return this.userQueryRepository.meUser(payload.userId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RefreshAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request, @ExtractAnyUserFromRequest() payload: UserJwtPayloadDto) {
        const { refreshToken } = req.cookies;
        const dtoRefresh = refreshToken ? refreshToken : null;
        return this.commandBus.execute(new LogoutUserCommand(dtoRefresh));
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @Post('refresh-token')
    async refreshToken(
        @ExtractAnyUserFromRequest() payload: UserJwtPayloadDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { jwt, refresh } = await this.commandBus.execute(
            new RefreshTokenUserCommand({
                iat: payload.iat,
                userId: payload.userId,
                deviceId: payload.deviceId,
                ip: req.ip || '',
                agent: req.headers['user-agent'] || '',
            }),
        );
        res.cookie('refreshToken', refresh, { httpOnly: true, secure: true });
        return {
            accessToken: jwt,
        };
    }
}
