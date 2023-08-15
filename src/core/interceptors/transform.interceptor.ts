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

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
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

    return { statusCode, method, data };
  }
}
