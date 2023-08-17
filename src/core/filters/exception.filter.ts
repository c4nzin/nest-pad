import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionFilter<T> implements ExceptionFilter<T> {
  public async catch(exception: T, host: ArgumentsHost): Promise<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException
        ? exception.getResponse()
        : new InternalServerErrorException().getResponse();

    response.status(status).json(res);
  }
}
