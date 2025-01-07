import { TestingDbRepositories } from '../infrastructure/testing.db.repository';

export class TestingService {
    constructor(private readonly testRepo: TestingDbRepositories) {}
    async blink() {
        await this.testRepo.delete();
    }
}
