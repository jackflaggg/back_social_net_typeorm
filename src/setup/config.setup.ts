import { INestApplication } from '@nestjs/common';
import { CoreConfig } from '../core/config/core.config';
import { pipesSetup } from './pipes.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { interceptorSetup } from './interceptor.setup';
import { swaggerSetup } from './swagger.setup';

export function configApp(app: INestApplication, coreConfig: CoreConfig) {
    pipesSetup(app);

    interceptorSetup(app);

    exceptionFilterSetup(app);

    swaggerSetup(app);

    app.enableCors({
        origin: '*',
    });
}
