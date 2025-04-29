import { Global, Module } from '@nestjs/common';
import { AppConfig } from './app.config';
import { ConfigModule } from '@nestjs/config';

/**
 * хоть и помечен как глобал, но в апп модуле должен быть зареган!
 */
@Global()
@Module({
    imports: [ConfigModule],
    exports: [AppConfig],
    providers: [AppConfig],
})
export class CoreModule {}
