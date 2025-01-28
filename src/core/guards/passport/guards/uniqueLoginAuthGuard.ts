import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UniqueLoginAuthGuard extends AuthGuard('unique-login') {}
export class UniqueEmailAuthGuard extends AuthGuard('unique-email') {}
