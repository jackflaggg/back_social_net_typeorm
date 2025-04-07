import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameQuestions } from './game-questions.entity';
import { Player } from './player.entity';
import { GameStatus, GameStatusType } from '../../../../libs/contracts/enums/quiz/game.status';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstPlayerId: string;

    @Column({ nullable: true })
    secondPlayerId: string;

    @OneToOne(() => Player)
    @JoinColumn({ name: 'firstPlayerId' })
    firstPlayer: Player;

    @OneToOne(() => Player)
    @JoinColumn({ name: 'secondPlayerId' })
    secondPlayer: Player;

    @OneToMany(() => GameQuestions, gameQuestions => gameQuestions.game)
    gameQuestions: GameQuestions[];

    @Column({ type: 'enum', enum: GameStatus })
    gameStatus: GameStatusType;

    @CreateDateColumn()
    pairCreatedDate: Date;

    @Column({ type: 'timestamptz', nullable: true })
    startGameDate: Date;

    @Column({ type: 'timestamptz', nullable: true })
    finishGameDate: Date;

    @OneToMany(() => GameQuestions, gameQuestions => gameQuestions.game)
    questions: GameQuestions[];

    static buildInstance(userId: string): Game {
        const game = new this();
        game.firstPlayerId = userId;
        game.gameStatus = GameStatus.enum['PendingSecondPlayer'];
        return game;
    }

    connectSecondPlayer(userId: string) {
        this.secondPlayerId = userId;
    }

    startGame() {
        this.gameStatus = GameStatus.enum['Active'];
        this.startGameDate = new Date();
    }
}
