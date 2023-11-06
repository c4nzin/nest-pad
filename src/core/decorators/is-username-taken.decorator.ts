import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { UserService } from 'src/features/user/user.service';

@ValidatorConstraint({ async: true })
export class IsUsernameIsTaken implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  public validate(
    username: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    return this.userService.findByUsername(username).then(() => {
      if (username) return false;
      return true;
    });
  }
}

export function IsUsernameAlreadyExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      propertyName,
      validator: IsUsernameIsTaken,
      target: object.constructor,
      async: true,
      constraints: [],
    });
  };
}
