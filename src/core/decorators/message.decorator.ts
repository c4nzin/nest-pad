import { SetMetadata } from '@nestjs/common';

export const MESSAGE_TOKEN = 'response-message';

export function Message(message: string): MethodDecorator {
  return (_, __, descriptor: PropertyDescriptor): PropertyDescriptor => {
    SetMetadata(MESSAGE_TOKEN, message)(descriptor.value);
    return descriptor;
  };
}
