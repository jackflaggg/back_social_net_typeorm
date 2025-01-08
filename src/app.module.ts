import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule } from './features/bloggers-platform/bloggers-platform.module';
import { TestingModule } from './features/testing/testing.module';
import { UsersModule } from './features/user-accounts/user-accounts.module';

@Module({
    imports: [MongooseModule.forRoot('mongodb://localhost:27017/top-api'), TestingModule, BloggersPlatformModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule {}
