import { UserCreateDtoService } from '../../../dto/service/user.create.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptService } from '../../other_services/bcrypt.service';
import { Inject } from '@nestjs/common';
import { UserRepositoryOrm } from '../../../infrastructure/typeorm/user/user.orm.repo';

export class CommonCreateUserCommand {
    constructor(public readonly payload: UserCreateDtoService) {}
}

@CommandHandler(CommonCreateUserCommand)
export class CommonCreateUserUseCase implements ICommandHandler<CommonCreateUserCommand> {
    constructor(
        @Inject() private readonly usersRepository: UserRepositoryOrm,
        private readonly bcryptService: BcryptService,
    ) {}

    async execute(command: CommonCreateUserCommand) {
        const hashPassword = await this.bcryptService.hashPassword(command.payload.password);
        // return await this.usersRepository.save(
        //     { ...command.payload, password: hashPassword, createdAt: new Date() },
        //     ...emailConfirmationData(),
        // );
    }
}
