import { NotFoundDomainException } from '../../../../core/exceptions/incubator-exceptions/domain-exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../domain/player.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class PlayerRepository {
    constructor(@InjectRepository(Player) private playerRepositoryTypeOrm: Repository<Player>) {}

    async createPlayer(userId: string): Promise<Player> {
        const player = Player.buildInstance(userId);
        const newPlayer = await this.playerRepositoryTypeOrm.save(player);
        return newPlayer;
    }

    async findPlayerById(playerId: string): Promise<Player> {
        const player = await this.playerRepositoryTypeOrm.findOne({ where: { id: Number(playerId), deletedAt: IsNull() } });
        if (!player) {
            throw NotFoundDomainException.create('Player not found');
        }
        return player;
    }
}
