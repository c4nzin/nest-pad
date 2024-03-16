import { Injectable, Scope } from '@nestjs/common';
import { logger } from './winston';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  public log(message: string, context?: string): void {
    logger.info(message, { context });
  }

  public error(message: string, trace: string, context?: string): void {
    logger.error(message, { context, trace });
  }

  public warn(message: string, context?: string): void {
    logger.warn(message, { context });
  }

  public debug(message: string, context?: string): void {
    logger.debug(message, { context });
  }
}
