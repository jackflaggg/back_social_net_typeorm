import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../domain/game.entity';
import { Repository } from 'typeorm';
import { GameStatus } from '../../../../libs/contracts/enums/quiz/game.status';

@Injectable()
export class GameRepository {
    constructor(@InjectRepository(Game) private gameRepositoryTypeOrm: Repository<Game>) {}

    async findGameByUserId(userId: string): Promise<Game | null> {
        const game = await this.gameRepositoryTypeOrm.findOne({ where: { firstPlayerId: userId } });
        return game;
    }

    async findAvailableGamePair(): Promise<Game | null> {
        const game = await this.gameRepositoryTypeOrm.findOne({ where: { gameStatus: GameStatus.enum['PendingSecondPlayer'] } });
        return game;
    }

    async createGamePair(playerId: string): Promise<string> {
        const game = Game.buildInstance(playerId);
        const newGame = await this.gameRepositoryTypeOrm.save(game);
        return newGame.id.toString();
    }

    async connectToGamePair(playerId: string, game: Game): Promise<string> {
        game.connectSecondPlayer(playerId);
        await this.gameRepositoryTypeOrm.save(game);
        return game.id.toString();
    }

    async startGame(game: Game): Promise<void> {
        game.startGame();
        await this.gameRepositoryTypeOrm.save(game);
    }
}
