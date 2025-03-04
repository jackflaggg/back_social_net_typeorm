import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UniqueUserAuthGuard extends AuthGuard('unique-user') {}
