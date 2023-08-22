import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user;

    if (data) {
      return user?.[data];
    }
    return user;
  },
);
