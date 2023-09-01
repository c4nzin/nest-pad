import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext): Express.User => {
    const request = context.switchToHttp().getRequest<Request>();
    return data ? request.user?.[data] : request.user;
  },
);
