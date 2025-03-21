import { INestApplication } from '@nestjs/common';
import { DomainExceptionsFilter } from '../exceptions/incubator-exceptions/filter/domain-exceptions-filter';

export function exceptionFilterSetup(app: INestApplication) {
    //Подключаем наши фильтры. Тут важна последовательность!
    // (сработает справа на лево)
    app.useGlobalFilters(new DomainExceptionsFilter());
}
