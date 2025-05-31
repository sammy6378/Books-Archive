import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './http-exceptions.filter';
import { ConfigService } from '@nestjs/config'; //npm install @nestjs/config

async function bootstrap() {
  // nestjs instance
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Enable all log levels
  });

  // global validation pipes
  // app.useGlobalPipes(new ValidationPipe());

  // exception filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // global prefix for routes
  app.setGlobalPrefix('api');

  // server config
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT') || 3000;

  await app.listen(PORT);

  Logger.log(`Server is running on http://localhost:${PORT}`);
}
bootstrap();
