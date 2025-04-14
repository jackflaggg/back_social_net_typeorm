import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SETTINGS } from '../../../../core/settings';
import { CommandBus } from '@nestjs/cqrs';
import { ValidateUUIDPipe } from '../../../../core/pipes/validation.input.uuid';

@Controller(SETTINGS.PATH.PAIR_GAME_QUIZ_PAIRS)
export class PairGameQuizPairsController {
    constructor(
        private readonly gameQueryRepository: GameQueryRepository,
        private readonly playerQueryRepository: PlayerQueryRepository,
        private readonly answerQueryRepository: AnswerQueryRepository,
        private readonly commandBus: CommandBus,
    ) {}

    @Get('my-current')
    @HttpCode(HttpStatus.OK)
    async getMyCurrentGame(@ExtractAnyUserFromRequest() user: UserJwtPayloadDto): Promise<any> {
        const game = await this.gameQueryRepository.findGameByUserId(user.userId);
        return game;
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getGameById(@ExtractAnyUserFromRequest() user: UserJwtPayloadDto, @Param('id') id: string): Promise<any> {
        const game = await this.gameQueryRepository.findGameByUserAndGameId(user.userId, id);
        return game;
    }

    @Post('connection')
    @HttpCode(HttpStatus.OK)
    async connection(@ExtractAnyUserFromRequest() user: UserJwtPayloadDto): Promise<any> {
        const userAlreadyInGame = await this.playerQueryRepository.findPlayerByUserId(user.userId);
        if (userAlreadyInGame) {
            throw ForbiddenDomainException.create('User is already in game');
        }

        const playerId = await this.commandBus.execute(new CreatePlayerCommand(user.userId));
        const gamePairId = await this.commandBus.execute(new ConnectToGamePairCommand(playerId));

        const gamePair = await this.gameQueryRepository.findGameById(gamePairId);

        return gamePair;
    }

    @Post('answers')
    @HttpCode(HttpStatus.OK)
    async answers(@ExtractAnyUserFromRequest() user: UserJwtPayloadDto, @Body() body: { answer: string }): Promise<any> {
        const answerId = await this.commandBus.execute(new CreateAnswerCommand(user.userId, body.answer));
        const answer = await this.answerQueryRepository.findAnswerById(answerId);
        return answer;
    }
}
