import { createZodDto } from 'nestjs-zod';
import { PostLikeCommand } from '../../../../../libs/contracts/commands/post/like.command';

export class PostLikeStatusApi extends createZodDto(PostLikeCommand.RequestSchema) {}
