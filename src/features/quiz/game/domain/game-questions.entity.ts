// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
//
// @Entity()
// export class GameQuestions {
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @ManyToOne(() => Question, question => question.gameQuestions)
//     @JoinColumn({ name: 'question_id' })
//     question: Question;
//
//     @Column()
//     questionId: string;
//
//     @ManyToOne(() => Game, game => game.gameQuestions)
//     @JoinColumn({ name: 'game_id' })
//     game: Game;
//
//     @Column()
//     gameId: string;
//
//     @Column()
//     index: number;
//
//     static buildInstance(gameId: string, questionId: string, index: number): GameQuestions {
//         const gameQuestion = new GameQuestions();
//         gameQuestion.gameId = gameId;
//         gameQuestion.questionId = questionId;
//         gameQuestion.index = index;
//         return gameQuestion;
//     }
// }
