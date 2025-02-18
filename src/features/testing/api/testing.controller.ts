import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserPgRepository } from '../../user-accounts/infrastructure/postgres/user/user.pg.repository';

@Controller('testing')
export class TestingController {
    constructor(private readonly userRepository: UserPgRepository) {}

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('all-data')
    async deleteAll() {
        try {
            await this.userRepository.deleteAll();
            return;
        } catch (err: unknown) {
            return err;
        }
    }
}
