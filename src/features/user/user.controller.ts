import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
