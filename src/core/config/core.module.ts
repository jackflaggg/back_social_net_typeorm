import { Global, Module } from '@nestjs/common';
import { AppConfig } from './app.config';
/**
 * Глобальный модуль приложения.
 * Предоставляет общие провайдеры и модули, доступные во всех частях приложения.
 * Не требует ручного импорта в app.module.ts.
 */
@Global()
@Module({
    exports: [AppConfig],
    providers: [AppConfig],
})
export class CoreModule {}
