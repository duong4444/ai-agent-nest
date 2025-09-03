import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LangchainModule } from './ai/langchain.module';
import { SimpleAgentService } from './agents/simple-agent.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LangchainModule,
  ],
  controllers: [AppController],
  providers: [SimpleAgentService],
})
export class AppModule {}
