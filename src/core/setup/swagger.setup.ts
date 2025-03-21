import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

export function swaggerSetup(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('Social Network API')
        .setDescription('The Social Network API description')
        .addBearerAuth()
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./docs/swagger.json', JSON.stringify(document));
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Social Network Swagger',
    });
}
