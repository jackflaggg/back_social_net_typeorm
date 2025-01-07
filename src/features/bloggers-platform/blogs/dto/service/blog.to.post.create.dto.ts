import { createZodDto } from 'nestjs-zod';
import { PostCreateCommand } from '@libs/contracts/commands/blog/post.to.blog.create.command';

export class PostToBlogCreateDtoService extends createZodDto(PostCreateCommand.RequestSchema) {}
