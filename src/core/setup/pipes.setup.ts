import { INestApplication } from '@nestjs/common';

import { ZodValidationPipe } from 'nestjs-zod';

export function pipesSetup(app: INestApplication): void {
    app.useGlobalPipes(new ZodValidationPipe());
}
