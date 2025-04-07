import { Column, Entity, OneToMany } from 'typeorm';
import { GameQuestions } from '../../game/domain/game-questions.entity';
import { Base } from '../../../../core/domain/base';

@Entity()
export class Question extends Base {
    @Column({ name: 'body', collation: 'C' })
    body: string;

    @Column({ name: 'correct_answers', type: 'jsonb' })
    correctAnswers: Array<string | number>;

    @Column({ name: 'published', default: false })
    published: boolean;

    @OneToMany(() => GameQuestions, gameQuestions => gameQuestions.question)
    gameQuestions: GameQuestions[];

    static buildInstance(body: string, correctAnswers: Array<string | number>): Question {
        const question = new this();
        question.body = body;
        question.correctAnswers = correctAnswers;
        return question;
    }

    markDeleted() {
        this.deletedAt = new Date();
    }

    update(body: string, correctAnswers: Array<string | number>) {
        this.body = body;
        this.correctAnswers = correctAnswers;
    }

    setPublishStatus(published: boolean) {
        this.published = published;
    }
}
