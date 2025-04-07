import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user-accounts/domain/typeorm/user/user.entity';
import { Answer } from './answer.entity';
import { PlayerStatus, PlayerStatusType } from '../../../../libs/contracts/enums/quiz/player.status';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.players)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @OneToMany(() => Answer, answer => answer.player)
    answers: Answer[];

    @Column({ type: 'int', default: 0 })
    score: number;

    @Column({ enum: PlayerStatus, nullable: true })
    status: PlayerStatusType;

    @Column({ type: 'timestamptz', nullable: true })
    deletedAt: Date;

    static buildInstance(userId: string): Player {
        const player = new this();
        player.userId = userId;
        return player;
    }

    markDeleted() {
        this.deletedAt = new Date();
    }
}
