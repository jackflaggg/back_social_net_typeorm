import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { ObjectIdValidationPipe } from '../core/pipes/validation.input.data.pipe';
interface CustomError {
    field: any; // Замените `any` на более конкретный тип, если возможно
    message: string;
}

export function pipesSetup(app: INestApplication) {
    app.useGlobalPipes(
        new ObjectIdValidationPipe(),
        new ValidationPipe({
            transform: true,
            stopAtFirstError: false,
            exceptionFactory: errors => {
                const customErrors: CustomError[] = [];
                errors.map(err => {
                    const constraintsKeys = Object.keys(err!.constraints!);
                    constraintsKeys.forEach(key => {
                        const msg = err!.constraints![key];
                        customErrors.push({ field: err.value, message: msg });
                    });
                });
                throw new BadRequestException(customErrors);
            },
        }),
    );
}
