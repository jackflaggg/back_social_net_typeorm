import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { AnswerStatus, AnswerStatusType } from '../../../../libs/contracts/enums/quiz/answer.status';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'answer', type: 'string' })
    answer: string;

    @Column({ name: 'answer_status', type: 'enum', enum: AnswerStatus })
    answerStatus: AnswerStatusType;

    @Column({ name: 'question_id' })
    questionId: number;

    @CreateDateColumn({ name: 'added_at' })
    addedAt: Date;

    @ManyToOne(() => Player, player => player.answers)
    @JoinColumn({ name: 'player_id' })
    player: Player;

    static buildInstance(answer: string, questionId: number): Answer {
        const answerEntity = new Answer();
        answerEntity.answer = answer;
        answerEntity.questionId = questionId;
        answerEntity.answerStatus = AnswerStatus.enum['Correct'];
        answerEntity.addedAt = new Date();
        return answerEntity;
    }
}
