import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'dist', 'client'),
      exclude: ['api*'],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}