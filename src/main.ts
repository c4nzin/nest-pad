import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from './config';
import { ExceptionFilter } from './core/filters';
import { TransformInterceptor } from './core/interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const config = app.get<Config>(ENV);

  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix(config.GLOBAL_PREFIX);

  await app.listen(config.PORT);
}
bootstrap();
