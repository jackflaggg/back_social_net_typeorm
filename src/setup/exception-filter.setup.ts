import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../core/exceptions/incubator-exceptions/filter/all-exceptions-filter';
import { DomainExceptionsFilter } from '../core/exceptions/incubator-exceptions/filter/domain-exceptions-filter';
import { CoreConfig } from '../core/config/core.config';

export function exceptionFilterSetup(app: INestApplication, coreConfig: CoreConfig) {
    //Подключаем наши фильтры. Тут важна последовательность! (сработает справа на лево)
    app.useGlobalFilters(new AllExceptionsFilter(coreConfig), new DomainExceptionsFilter());
}
