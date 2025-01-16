import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../core/exceptions/filter/all-exceptions-filter';
import { DomainExceptionsFilter } from '../core/exceptions/filter/domain-exceptions-filter';

export function exceptionFilterSetup(app: INestApplication) {
    //Подключаем наши фильтры. Тут важна последовательность! (сработает справа на лево)
    app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionsFilter());
    // app.useGlobalFilters(new SimpleExeptionFilter());
}
