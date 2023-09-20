import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import { setupApp } from './setup-app';
import { setupSwagger } from './setup-swagger';
import { Config, ENV } from './config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get<Config>(ENV);

  await setupApp(app);
  setupSwagger(app);

  await app.listen(config.PORT);
}

bootstrap();
