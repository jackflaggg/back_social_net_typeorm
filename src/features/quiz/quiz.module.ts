import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Question } from './questions/domain/question.entity';
import { GameQuestions } from './game/domain/game-questions.entity';
import { Answer } from './game/domain/answer.entity';
import { Player } from './game/domain/player.entity';
import { Game } from './game/domain/game.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Question, Answer, GameQuestions, Player, Game])],
})
export class QuizModule {}
