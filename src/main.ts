import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { exceptionFilterSetup } from './setup/exception-filter.setup';
import { interceptorSetup } from './setup/interceptor.setup';
import { pipesSetup } from './setup/pipes.setup';
import { swaggerSetup } from './setup/swagger.setup';
import * as process from 'node:process';
import { CoreConfig } from './core/config/core.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const coreConfig = app.get<CoreConfig>(CoreConfig);

    app.use(cookieParser());

    exceptionFilterSetup(app, coreConfig);

    interceptorSetup(app);

    swaggerSetup(app);
    pipesSetup(app);
    await app.listen(coreConfig.port, () => {
        console.log('Server started on port ' + coreConfig.port);
    });
}
bootstrap();
