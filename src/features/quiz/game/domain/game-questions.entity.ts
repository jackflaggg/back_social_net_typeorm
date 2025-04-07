import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../questions/domain/question.entity';
import { Game } from './game.entity';

@Entity('game_questions')
export class GameQuestions {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Question, question => question.gameQuestions)
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ name: 'question_id' })
    questionId: string;

    @ManyToOne(() => Game, game => game.gameQuestions)
    @JoinColumn({ name: 'game_id' })
    game: Game;

    @Column({ name: 'game_id' })
    gameId: string;

    @Column({ name: 'index' })
    index: number;

    static buildInstance(gameId: string, questionId: string, index: number): GameQuestions {
        const gameQuestion = new GameQuestions();
        gameQuestion.gameId = gameId;
        gameQuestion.questionId = questionId;
        gameQuestion.index = index;
        return gameQuestion;
    }
}
