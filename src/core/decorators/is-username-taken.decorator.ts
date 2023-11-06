import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { UserService } from 'src/features/user/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernameIsTaken implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  public async validate(username: string): Promise<boolean> {
    return await this.userService.findByUsername(username).then((user) => {
      if (user) {
        throw new UnprocessableEntityException('Username is already exists');
      } else {
        return true;
      }
    });
  }
  public defaultMessage(validationArguments?: ValidationArguments): string {
    return `username is already exists, ${validationArguments.value}`;
  }
}

export function IsUsernameAlreadyExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string): void {
    registerDecorator({
      propertyName,
      validator: IsUsernameIsTaken,
      target: object.constructor,
      async: true,
      constraints: [],
      options: validationOptions,
      name: 'username',
    });
  };
}
