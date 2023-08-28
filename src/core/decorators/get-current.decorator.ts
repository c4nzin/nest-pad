import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getClient } from '../../utils/get-client';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getClient(ctx)?.user,
);
