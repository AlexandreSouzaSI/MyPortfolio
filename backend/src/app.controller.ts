import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // Health check simples — útil pra confirmar que o backend subiu (local
  // ou depois de um deploy).
  @Get()
  getHealth() {
    return this.appService.getHealth();
  }
}
