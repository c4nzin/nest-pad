import { Logger } from 'nestjs-pino';
import {
  Injectable,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    const ctx = context.switchToHttp();
    const method = ctx.getRequest<Request>().method;
    const url = ctx.getRequest<Request>().url;

    this.logger.log(`Incoming request: ${method} , ${url}`);

    return next.handle().pipe(
      tap({
        next: () => this.logSuccess(context),
        error: (error) => this.logFailure(error, context),
      }),
    );
  }

  private logSuccess(context: ExecutionContext): void {
    const ctx = context.switchToHttp();
    const { method, url } = ctx.getRequest<Request>();
    const { statusCode } = ctx.getResponse<Response>();

    const message = `Outgoing Response : ${method} - ${url} - ${statusCode}`;

    this.logger.log(message);
  }

  private logFailure(error: Error, context: ExecutionContext): void {
    const ctx = context.switchToHttp().getRequest<Request>();
    const { method, url } = ctx;

    if (!(error instanceof HttpException)) {
      const message = `Outgoing Response - ${method} - ${url}`;
      return this.logger.error(message, error.stack);
    }

    const statusCode = error.getStatus();
    const message = `Outgoing response - ${statusCode} - ${method} - ${url}`;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(message, error.stack);
    }

    this.logger.warn(message, error.message);
  }
}
