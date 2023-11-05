import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards';
import { Message, User } from 'src/core/decorators';
import { User as IUser } from './user.schema';

@Controller()
@UseGuards(AccessTokenGuard)
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Message('Succesffully fetched the logged user')
  public getLoggedUser(@User() user: IUser) {
    return this.userService.loggedUser(user.username);
  }
}
