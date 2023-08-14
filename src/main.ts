import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from './config';
import { ExceptionFilter } from './core/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const config = app.get<Config>(ENV);
  app.useGlobalFilters(new ExceptionFilter());

  await app.listen(config.PORT);
}
bootstrap();
