import { Controller, Delete } from '@nestjs/common';
import { TestingService } from '../application/testing.service';

@Controller('testing')
export class TestingController {
    constructor(private readonly testingService: TestingService) {}

    @Delete('all-data')
    async blink() {
        await this.testingService.blink();
    }
}
