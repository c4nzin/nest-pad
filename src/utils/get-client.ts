import { ExecutionContext } from '@nestjs/common';
import { User, UserDocument } from 'src/features/user/user.schema';

export interface Client {
  user: User | UserDocument;
}

export const getClient = <T = Client>(ctx: ExecutionContext): T => {
  return ctx.switchToHttp().getRequest();
};
