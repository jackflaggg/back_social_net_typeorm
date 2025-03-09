import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { CoreConfig } from './core/config/core.config';
import { configApp } from './setup/config.setup';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);

    const coreConfig = appContext.get<CoreConfig>(CoreConfig);

    await appContext.close();

    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    configApp(app);

    await app.listen(coreConfig.port, () => {
        console.log('Сервер запущен на порту: ' + coreConfig.port + ' порт!');
    });
}

bootstrap();
