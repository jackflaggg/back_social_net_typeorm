import { createZodDto } from 'nestjs-zod';
import { PostToBlogCreateCommand } from '../../../../../libs/contracts/commands/blog/post.to.blog.create.command';

export class PostToBlogCreateDtoApi extends createZodDto(PostToBlogCreateCommand.RequestSchema) {}
