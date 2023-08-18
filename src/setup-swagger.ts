import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Memo pal')
  .setDescription('Api')
  .setVersion('1.0')
  .addTag('notes')
  .build();
