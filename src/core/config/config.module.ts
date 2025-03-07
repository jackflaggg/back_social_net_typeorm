import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './core.config';

// его я создаю сам!
// глобальный модуль для провайдеров и модулей,
// необходимых во всех частях приложения
@Global() // означает что не нужно вручную импортировать в app.module.ts
@Module({
    exports: [CoreConfig],
    providers: [CoreConfig],
})
export class CoreModule {}
