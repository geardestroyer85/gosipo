import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@shared/interface';

@Controller('api')
export class AppController {
  @Get('hello')
  getHello(): ApiResponse {
    return { message: 'Hi, client!' };
  }
}