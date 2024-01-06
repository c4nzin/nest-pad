import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import {
  ValidationError,
  ValidationOptions,
  ValidatorOptions,
  isObject,
  validate,
} from 'class-validator';
import { iterate } from 'iterare';

const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';
const isNil = (obj: any): obj is null | undefined => isUndefined(obj) || obj === null;

interface CustomPipeValidationOptions extends ValidationOptions {
  transform?: boolean;
  transformOptions?: ClassTransformOptions;
  validateCustomDecorators?: boolean;
}

@Injectable()
export class CustomPipeValidation implements PipeTransform<any> {
  isTransformEnabled: boolean;
  transformOptions: ClassTransformOptions;
  validateCustomDecorators: boolean;
  validatorOptions: ValidatorOptions;

  constructor(@Optional() options?: CustomPipeValidationOptions) {
    options = options || {};

    const { validateCustomDecorators, transformOptions, transform, ...validatorOptions } = options;

    this.isTransformEnabled = !!transform;
    this.transformOptions = transformOptions;
    this.validatorOptions = validatorOptions;
    this.validateCustomDecorators = validateCustomDecorators || false;
  }

  public async transform(value: any, { metatype }: ArgumentMetadata) {
    let object = plainToClass(metatype, value, this.transformOptions);

    const errors = await validate(object, {
      forbidNonWhitelisted: true,
      whitelist: true,
      stopAtFirstError: false,
      ...this.validatorOptions,
    });

    const originalValue = value;
    value = this.toEmptyIfNil(value);
    const isNil = value !== originalValue;

    const isPrimitive = this.isPrimitive(value);

    if (!isPrimitive) {
      object.constructor = metatype;
    } else {
      object = value;
    }

    if (isNil) return originalValue;

    if (!this.validateInstances(metatype) || !this.validate(metatype)) {
      return value;
    }

    if (errors.length === 0) return value;

    if (this.isTransformEnabled) return object;

    const errorMessages = errors.flatMap((error: ValidationError) =>
      Object.values(error.constraints),
    );

    throw new BadRequestException(errorMessages);
  }

  public validateInstances(metatype: Function) {
    const instances: Function[] = [String, Object, Number, Boolean, Array];

    return !instances.includes(metatype);
  }

  protected toEmptyIfNil<T = any, R = any>(value: T): R | {} {
    return isNil(value) ? {} : value;
  }

  protected isPrimitive(value: unknown): boolean {
    return ['number', 'boolean', 'string'].includes(typeof value);
  }

  protected validate(
    object: Object,
    validatorOptions?: ValidationOptions,
  ): Promise<ValidationError[] | ValidationError[]> {
    return validate(object, validatorOptions);
  }

  protected stripProtoKeys(value: Record<string, any>) {
    delete value.__proto__;
    const keys = Object.keys(value);

    iterate(keys)
      .filter((key) => isObject(value[key]) && value[key])
      .forEach((key) => this.stripProtoKeys(value[key]));
  }
}
