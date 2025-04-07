import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameQuestions } from './game-questions.entity';
import { Player } from './player.entity';
import { GameStatus, GameStatusType } from '../../../../libs/contracts/enums/quiz/game.status';

@Entity()
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'finish_player_id', nullable: true })
    firstPlayerId: string;

    @Column({ name: 'second_player_id', nullable: true })
    secondPlayerId: string;

    @OneToOne(() => Player)
    @JoinColumn({ name: 'first_player_id' })
    firstPlayer: Player;

    @OneToOne(() => Player)
    @JoinColumn({ name: 'second_player_id' })
    secondPlayer: Player;

    @OneToMany(() => GameQuestions, gameQuestions => gameQuestions.game)
    gameQuestions: GameQuestions[];

    @Column({ name: 'game_status', type: 'enum', enum: GameStatus })
    gameStatus: GameStatusType;

    @CreateDateColumn()
    pairCreatedDate: Date;

    @Column({ name: 'start_game_date', type: 'timestamptz', nullable: true })
    startGameDate: Date;

    @Column({ name: 'finish_game_date', type: 'timestamptz', nullable: true })
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
