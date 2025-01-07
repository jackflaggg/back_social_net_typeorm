import { createZodDto } from 'nestjs-zod';
import { PostCreateCommand } from '@libs/contracts/commands/blog/post.to.blog.create.command';

export class PostToBlogCreateDtoApi extends createZodDto(PostCreateCommand.RequestSchema) {}
