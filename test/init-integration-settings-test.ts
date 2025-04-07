import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

export const initIntegrationTestingModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    return module;
};
