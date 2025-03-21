import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { interceptorSetup } from './interceptor.setup';
import { swaggerSetup } from './swagger.setup';

export function fullConfigApp(app: INestApplication): void {
    pipesSetup(app);

    interceptorSetup(app);

    exceptionFilterSetup(app);

    swaggerSetup(app);

    app.enableCors({
        origin: '*',
    });
}
