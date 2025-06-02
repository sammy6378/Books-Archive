import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seeding endpoints...');
    try {
      const result = await this.seedService.seed();
      return result;
    } catch (error) {
      this.logger.error('Seeding failed', error);
      throw error;
    }
  }
}
