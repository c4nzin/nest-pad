import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class ObjectIdPipeValidation
  implements PipeTransform<string, Types.ObjectId>
{
  public transform(value: string): Types.ObjectId {
    if (!ObjectId.isValid(value))
      throw new BadRequestException('Invalid objectid format');

    return new Types.ObjectId(value);
  }
}
