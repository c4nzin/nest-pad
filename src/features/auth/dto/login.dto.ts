import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty()
  public password: string;

  @IsString()
  @ApiProperty()
  public username: string;
}
