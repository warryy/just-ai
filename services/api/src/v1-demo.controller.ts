import { Controller, Get, Version } from '@nestjs/common';

@Controller()
export class V1Controller {
  @Version('1')
  @Get('ping')
  ping() {
    return { pong: true, v: 1 };
  }
}
