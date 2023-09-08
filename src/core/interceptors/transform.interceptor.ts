import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces';
import { Reflector } from '@nestjs/core';
import { MESSAGE_TOKEN } from '../decorators/message.decorator';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> {
    return next.handle().pipe(map((data) => this.transformData(data, context)));
  }

  private transformData(data: T, context: ExecutionContext): IResponse<T> {
    const response = context.switchToHttp().getResponse<Response>();
    const {
      statusCode,
      req: { method },
    } = response;
    const message = this.reflector.get<string>(
      MESSAGE_TOKEN,
      context.getHandler(),
    );

    return { message, statusCode, method, data };
  }
}
