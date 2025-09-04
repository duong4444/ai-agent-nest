import {
  Controller,
  Get,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SimpleAgentService } from './agents/simple-agent.service';
import { InteractiveAgentService } from './agents/interactive-agent.service';

@Controller()
export class AppController {
  constructor(
    private readonly agentService: SimpleAgentService,
    private readonly interactiveAgentService: InteractiveAgentService,
  ) {}

  // /ask?question=...
  @Get('ask')
  async askTheAgent(@Query('question') question: string) {
    if (question?.trim() === '') {
      throw new BadRequestException(
        'Query parameter "question" cannot be empty.',
      );
    }

    try {
      const answer = await this.agentService.ask(question);
      return {
        question: question,
        answer: answer,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error interacting with AI Agent:', error);
      throw new InternalServerErrorException(
        `Sorry, an error occurred while processing your request. Please try again later.`,
      );
    }
  }

  // /interact?question=...
  @Get('interact')
  async interactWithAgent(@Query('question') question: string) {
    if (!question?.trim()) {
      throw new BadRequestException(
        'Query parameter "question" cannot be empty.',
      );
    }
    try {
      const answer = await this.interactiveAgentService.interact(question);
      return { question, answer, timestamp: new Date().toISOString() };
    } catch (error) {
      throw new InternalServerErrorException(
        `Lỗi xử lý yêu cầu: ${error.message}`,
      );
    }
  }
}
