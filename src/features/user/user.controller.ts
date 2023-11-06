import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards';
import { Message, User } from 'src/core/decorators';
import { User as IUser } from './user.schema';
import { userReturnType } from './repositories/user.repository';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @SerializeOptions({ groups: ['user'] })
  @Message('Succesffully fetched the logged user')
  public getLoggedUser(@User() user: IUser): Promise<userReturnType> {
    return this.userService.loggedUser(user.username);
  }
}
