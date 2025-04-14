import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Player } from '../../domain/player.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class PlayerQueryRepository {
    constructor(@InjectRepository(Player) private playerRepositoryTypeOrm: Repository<Player>) {}

    async findPlayerByUserId(userId: string): Promise<Player | null> {
        const player = await this.playerRepositoryTypeOrm.findOne({ where: { userId: userId, deletedAt: IsNull() } });
        return player;
    }
}
