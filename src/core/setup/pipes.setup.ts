import { INestApplication, ValidationError, ValidationPipe } from '@nestjs/common';
import { BadRequestDomainException } from '../exceptions/incubator-exceptions/domain-exceptions';
import { AppModule } from '../../app.module';
import { useContainer } from 'class-validator';

type ErrorResponse = { message: string; field: string };

//функция использует рекурсию для обхода объекта children при вложенных полях при валидации
//поставьте логи и разберитесь как она работает
//TODO: tests
export const errorFormatter = (errors: ValidationError[], errorMessage?: any): ErrorResponse[] => {
    const errorsForResponse = errorMessage || [];

    for (const error of errors) {
        if (!error?.constraints && error?.children?.length) {
            errorFormatter(error.children, errorsForResponse);
        } else if (error?.constraints) {
            const constrainKeys = Object.keys(error.constraints);

            for (const key of constrainKeys) {
                errorsForResponse.push({
                    message: error.constraints[key] ? `${error.constraints[key]}; Received value: ${error?.value}` : '',
                    field: error.property,
                });
            }
        }
    }

    return errorsForResponse;
};

export function pipesSetup(app: INestApplication): void {
    // app.useGlobalPipes(new ZodValidationPipe());
    //Глобальный пайп для валидации и трансформации входящих данных.
    //По сути мидлвар для валидации который отлавливает все валидации от class-validator
    app.useGlobalPipes(
        new ValidationPipe({
            //class-transformer создает экземпляр dto
            //соответственно применятся значения по-умолчанию
            //и методы классов dto
            transform: true, // транформирует данные по типам, например если приходит uri параметр id строкой но указать тип number то он автоматически трансформирует в число
            //Выдавать первую ошибку для каждого поля если их много
            stopAtFirstError: true,
            //получить все ошибки и обработать более кастомно
            exceptionFactory: errors => {
                const formattedErrors = errorFormatter(errors);

                throw new BadRequestDomainException(formattedErrors);
            },
        }),
    );
}

export const validationConstraintSetup = (app: INestApplication) => {
    // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
    // когда DI не имеет необходимого класса.
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
};
