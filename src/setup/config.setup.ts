import { INestApplication } from '@nestjs/common';
import { CoreConfig } from '../core/config/core.config';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';

export function configApp(app: INestApplication, coreConfig: CoreConfig) {
    pipesSetup(app);
    // globalPrefixSetup(app);

    exceptionFilterSetup(app, coreConfig);

    app.enableCors({
        origin: '*',
    });
}
