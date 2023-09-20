import { Reflector } from '@nestjs/core';

export const MESSAGE_TOKEN = 'response-message';

export const Message = Reflector.createDecorator<string>({
  key: MESSAGE_TOKEN,
});
