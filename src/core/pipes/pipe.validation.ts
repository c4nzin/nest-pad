import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ValidationError
} from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe<T> implements PipeTransform<T> {
  public async transform(value, metadata: ArgumentMetadata): Promise<T> {
    if (!value) {
      throw new BadRequestException('No data submitted')
    }

    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object, { stopAtFirstError: true })

    const collectedErrors = errors.flatMap((error: ValidationError) =>
      Object.keys(error.constraints)
    )

    throw new BadRequestException(collectedErrors)
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find((type) => metatype === type)
  }
}
