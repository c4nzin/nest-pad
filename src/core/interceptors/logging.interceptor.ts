import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    this.logger.log(`Incoming request: ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        this.logResponse(method, url, statusCode);
      }),
      catchError((error) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        this.logResponse(method, url, statusCode, true);
        return throwError(error);
      }),
    );
  }

  private logResponse(
    method: string,
    url: string,
    statusCode: number,
    isError = false,
  ): void {
    const logFn = isError
      ? this.logger.error.bind(this.logger)
      : this.logger.log.bind(this.logger);
    const message = `Outgoing Response: ${method} ${url} Status: ${statusCode}`;
    logFn(message);
  }
}
