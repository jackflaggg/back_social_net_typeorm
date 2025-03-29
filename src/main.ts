import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppConfig } from './core/config/app.config';
import { fullConfigApp } from './core/setup/config.setup';

async function bootstrap(): Promise<void> {
    const appContext = await NestFactory.createApplicationContext(AppModule);

    const coreConfig = appContext.get<AppConfig>(AppConfig);

    await appContext.close();

    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    fullConfigApp(app);

    await app.listen(coreConfig.port, () => {
        console.log('Сервер запущен на порту: ' + coreConfig.port);
    });
}

bootstrap().then();
