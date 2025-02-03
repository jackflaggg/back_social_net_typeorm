import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'fs';

export function swaggerSetup(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('INCTAGRAM API')
        .setDescription('The Inctagram API description')
        .addBearerAuth()
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./docs/swagger.json', JSON.stringify(document));
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Inctagram Swagger',
    });
}
