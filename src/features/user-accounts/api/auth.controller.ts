import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { UserQueryRepository } from '../infrastructure/user/query/user.query.repository';
import { GetUsersQueryParams } from '../dto/api/get-users-query-params.input-dto';
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
import { PasswordRecoveryCommand } from '@libs/contracts/commands/auth/password-recovery.command';
import { RegistrationCommand, RegistrationSchema } from '@libs/contracts/commands/auth/registration.command';
import { RegistrationUserCommand } from '../application/user/usecases/registration-user.usecase';
import { UniqueEmailAuthGuard, UniqueLoginAuthGuard } from '../../../core/guards/passport/guards/uniqueLoginAuthGuard';
import { RegistrationConfirmationUserCommand } from '../application/user/usecases/registration-confirmation-user.usecase';
import { PasswordRecoveryUserCommand } from '../application/user/usecases/password-recovery-user.usecase';
import { RegistrationEmailResendingCommand } from '@libs/contracts/commands/auth/registration-email-resending.command';
import { RegistrationEmailResendUserCommand } from '../application/user/usecases/registration-email-resend-user.usecase';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userQueryRepository: UserQueryRepository,
    ) {}
    @HttpCode(200)
    @UseGuards(ThrottlerGuard, LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Body() dto: AuthLoginDtoApi) {
        const { jwt, refresh } = await this.commandBus.execute(new LoginUserCommand(req.ip, req.headers['user-agent'], req.user));
        res.cookie('refreshToken', refresh, { httpOnly: true, secure: true, maxAge: 86400 });
        return {
            accessToken: jwt,
        };
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('password-recovery')
    async passwordRecovery(@Body() dto: AuthPasswordRecoveryDtoApi) {
        return this.commandBus.execute(new PasswordRecoveryUserCommand(dto.email));
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('new-password')
    async newPassword(@Body() dto: AuthNewPasswordDtoApi) {
        //return this.userService.newPassword(dto);
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard, UniqueEmailAuthGuard, UniqueLoginAuthGuard)
    @Post('registration')
    async registration(@Body() dto: AuthRegistrationDtoApi) {
        return this.commandBus.execute(new RegistrationUserCommand(dto));
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() dto: AuthRegistrationConfirmationDtoApi) {
        return this.commandBus.execute(new RegistrationConfirmationUserCommand(dto.code));
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('registration-email-resending')
    async registrationEmailResend(@Body() dto: AuthRegistrationEmailResendingDtoApi) {
        return this.commandBus.execute(new RegistrationEmailResendUserCommand(dto.email));
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Query() query: GetUsersQueryParams) {
        //return this.userQueryRepository.getAllUsers(query);
    }

    @Post('logout')
    async logout() {
        //return this.userQueryRepository.getAllUsers(query);
    }

    @Post('refreshToken')
    async refreshToken() {
        //return this.userQueryRepository.getAllUsers(query);
    }
}
