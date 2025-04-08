import { createZodDto } from 'nestjs-zod';
import { QuestionCreateCommand } from '../../../../../libs/contracts/commands/quiz/question/create.command';

export class QuestionCreateDtoApi extends createZodDto(QuestionCreateCommand.RequestSchema) {}
