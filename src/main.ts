import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { CoreConfig } from './core/config/core.config';
import { configApp } from './setup/config.setup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const coreConfig = app.get<CoreConfig>(CoreConfig);

    app.use(cookieParser());
    configApp(app, coreConfig);
    await app.listen(coreConfig.port, () => {
        console.log('Server started on port ' + coreConfig.port);
    });
}
bootstrap();
