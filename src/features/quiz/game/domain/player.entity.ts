import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../../user-accounts/domain/typeorm/user/user.entity';
import { Answer } from './answer.entity';
import { PlayerStatus, PlayerStatusType } from '../../../../libs/contracts/enums/quiz/player.status';
import { BaseEntityDeletedAtAndId } from '../../../../core/domain/base';

@Entity('player')
export class Player extends BaseEntityDeletedAtAndId {
    @ManyToOne(() => User, user => user.players)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToMany(() => Answer, answer => answer.player)
    answers: Answer[];

    @Column({ name: 'score', type: 'int', default: 0 })
    score: number;

    @Column({ name: 'status', enum: PlayerStatus.enum, nullable: true })
    status: PlayerStatusType;

    static buildInstance(userId: string): Player {
        const player = new this();
        player.userId = userId;
        return player;
    }

    markDeleted() {
        this.deletedAt = new Date();
    }
}
