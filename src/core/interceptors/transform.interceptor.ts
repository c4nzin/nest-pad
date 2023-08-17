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
  constructor(private readonly reflector: Reflector) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Promise<Observable<any>> {
    return next.handle().pipe(map((data) => this.modifyData(data, context)));
  }

  public async modifyData(
    data: T,
    context: ExecutionContext,
  ): Promise<IResponse<T>> {
    const ctx = context.switchToHttp().getResponse<Response>();
    const statusCode = ctx.statusCode;
    const method = ctx.req.method;
    const handler = context.getHandler();
    const message = this.reflector.get<string>(MESSAGE_TOKEN, handler);

    return { message, statusCode, method, data };
  }
}
