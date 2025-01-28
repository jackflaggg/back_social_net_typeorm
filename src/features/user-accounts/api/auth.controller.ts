import { Body, Controller, Get, HttpCode, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
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
import { RegistrationCommand } from '@libs/contracts/commands/auth/registration.command';
import { RegistrationUserCommand } from '../application/user/usecases/registration-user.usecase';

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
            refreshToken: refresh,
        };
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('password-recovery')
    async passwordRecovery(@Body() dto: AuthRegistrationDtoApi) {
        return this.commandBus.execute(new RegistrationUserCommand(dto));
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('new-password')
    async newPassword(@Body() dto: AuthNewPasswordDtoApi) {
        //return this.userService.newPassword(dto);
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('registration')
    async registration(@Body() dto: AuthRegistrationDtoApi) {
        //return this.userService.registration(dto);
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('registration-confirmation')
    async registrationConfirmation(@Body() dto: AuthRegistrationConfirmationDtoApi) {
        //return this.userService.registrationConfirmation(dto);
    }
    @HttpCode(204)
    @UseGuards(ThrottlerGuard)
    @Post('registration-email-resending')
    async registrationEmailResend(@Body() dto: AuthRegistrationEmailResendingDtoApi) {
        //return this.userService.emailResend(dto);
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Query() query: GetUsersQueryParams) {
        //return this.userQueryRepository.getAllUsers(query);
    }
}
