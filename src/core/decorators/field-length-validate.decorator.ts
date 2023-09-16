import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class FieldLengthValidator implements ValidatorConstraintInterface {
  public async validate(
    value: string,
    args?: ValidationArguments,
  ): Promise<boolean> {
    const [minLength, maxLength] = args.constraints;

    const isOutOfRange = value.length < minLength || value.length > maxLength;
    if (isOutOfRange) {
      return true;
    }

    return false;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    const [target, minLength, maxLength] = validationArguments.constraints;
    return `${target} length should be between ${minLength} and ${maxLength} characters.`;
  }
}

export function IsValidLength(
  property: string,
  minLength: number,
  maxLength?: number,
) {
  return (target: Object, propertyName: string): void => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      validator: FieldLengthValidator,
      constraints: [property, minLength, maxLength],
    });
  };
}
