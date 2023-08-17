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
    const method = ctx.getRequest<Request>().method;
    const url = ctx.getRequest<Request>().url;
    const statusCode = ctx.getResponse<Response>().statusCode;

    this.logger.log(`Response: ${method} , ${url}, ${statusCode}`);
  }

  private logFailure(error: Error, context: ExecutionContext): void {
    const ctx = context.switchToHttp();
    const method = ctx.getRequest<Request>().method;
    const url = ctx.getRequest<Request>().url;
    const statusCode = ctx.getResponse<Response>().statusCode;

    error instanceof HttpException
      ? `Stack : ${statusCode}, ${method}, ${url} `
      : this.logger.error(`Stack: ${method}, ${url}`, error.stack);

    statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
      ? this.logger.error(`Stack: ${statusCode}, ${method}, ${url}`)
      : this.logger.log(`Stack: ${statusCode}, ${method}, ${url}`, error);
  }
}
