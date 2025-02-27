import { INestApplication } from '@nestjs/common';
import { DomainExceptionsFilter } from '../core/exceptions/incubator-exceptions/filter/domain-exceptions-filter';

export function exceptionFilterSetup(app: INestApplication) {
    //Подключаем наши фильтры. Тут важна последовательность! (сработает справа на лево)
    app.useGlobalFilters(new DomainExceptionsFilter());
}
