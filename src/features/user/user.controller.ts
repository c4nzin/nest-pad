import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards';
import { Message, User } from 'src/core/decorators';

@Controller()
@UseGuards(AccessTokenGuard)
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  @Message('Succesffully fetched the logged user')
  public getLoggedUser(@User('sub') id: string) {
    return this.userService.loggedUser(id);
  }
}
