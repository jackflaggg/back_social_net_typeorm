import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Question } from './questions/domain/question.entity';
import { GameQuestions } from './game/domain/game-questions.entity';
import { Answer } from './game/domain/answer.entity';
import { Player } from './game/domain/player.entity';
import { Game } from './game/domain/game.entity';
import { QuestionsSaController } from './questions/api/questions.sa.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PairGameQuizUsersController } from './game/api/pair-game-quiz.users.controller';
import { QuestionsQueryRepository } from './questions/infrastructure/typeorm/query/questions.query-repository';
import { GameQueryRepository } from './game/infrastructure/query/game.query-repository';
import { CreateQuestionUseCase } from './questions/applications/usecases/create-question.usecase';
import { UpdateQuestionUseCase } from './questions/applications/usecases/update-question.usecase';
import { PublishQuestionUseCase } from './questions/applications/usecases/publish-question.usecase';
import { DeleteQuestionUseCase } from './questions/applications/usecases/delete-question.usecase';
import { ConnectToGamePairUseCase } from './game/application/connect-game.usecase';
import { CreatePlayerUseCase } from './game/application/create-player.usecase';
import { SelectQuestionsForGamePairUseCase } from './game/application/select-questions-for-game.usecase';
import { CreateAnswerUseCase } from './game/application/create-answer.usecase';
import { QuestionsRepository } from './questions/infrastructure/typeorm/questions-repository';
import { AnswerQueryRepository } from './game/infrastructure/query/answer.query-repository';
import { AnswerRepository } from './game/infrastructure/answer.repository';
import { GameQuestionsRepository } from './game/infrastructure/game-questions.repository';
import { GameRepository } from './game/infrastructure/game.repository';
import { PlayerQueryRepository } from './game/infrastructure/query/player.query-repository';
import { PlayerRepository } from './game/infrastructure/player.repository';

const useCases = [
    CreateQuestionUseCase,
    UpdateQuestionUseCase,
    PublishQuestionUseCase,
    DeleteQuestionUseCase,
    ConnectToGamePairUseCase,
    CreatePlayerUseCase,
    SelectQuestionsForGamePairUseCase,
    CreateAnswerUseCase,
];

const repositories = [
    QuestionsRepository,
    QuestionsQueryRepository,
    PlayerRepository,
    PlayerQueryRepository,
    GameRepository,
    GameQueryRepository,
    GameQuestionsRepository,
    AnswerRepository,
    AnswerQueryRepository,
];
@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Question, Answer, GameQuestions, Player, Game])],
    controllers: [QuestionsSaController, PairGameQuizUsersController, PairGameQuizUsersController],
    providers: [...repositories, ...useCases],
})
export class QuizModule {}
