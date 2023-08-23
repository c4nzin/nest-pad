import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public username: string;
}
