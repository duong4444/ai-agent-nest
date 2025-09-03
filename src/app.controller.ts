import { Controller, Get, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SimpleAgentService } from './agents/simple-agent.service';

@Controller()
export class AppController {
  constructor(private readonly agentService: SimpleAgentService) {}

  @Get('ask')
  async askTheAgent(@Query('question') question: string) {
    if (question?.trim() === '') {
      throw new BadRequestException('Query parameter "question" cannot be empty.');
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
      throw new InternalServerErrorException(`Sorry, an error occurred while processing your request. Please try again later.`);
    }
  }
}
