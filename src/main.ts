import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { exceptionFilterSetup } from './setup/exception-filter.setup';
import { interceptorSetup } from './setup/interceptor.setup';
import { pipesSetup } from './setup/pipes.setup';
import { swaggerSetup } from './setup/swagger.setup';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    exceptionFilterSetup(app);

    interceptorSetup(app);

    app.enableCors();

    swaggerSetup(app);
    pipesSetup(app);
    console.log(process.env.PORT);
    await app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}
bootstrap();
