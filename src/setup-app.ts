import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Config, ENV } from './config';
import { Logger } from 'nestjs-pino';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import compression from 'compression';
import { HttpExceptionFilter } from './core/filters';
import { LoggingInterceptor, TransformInterceptor } from './core/interceptors';
import { ValidationPipe } from './core/pipes';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export async function setupApp(app: NestExpressApplication): Promise<void> {
  const config = app.get<Config>(ENV);
  const logger = app.get<Logger>(Logger);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableCors({ credentials: true, origin: config.ORIGIN });

  app.use(
    ExpressMongoSanitize({ allowDots: true, replaceWith: '_', dryRun: true }),
  );

  app.use(helmet());
  app.use(compression({ threshold: 0 }));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.setGlobalPrefix(config.GLOBAL_PREFIX);
}
