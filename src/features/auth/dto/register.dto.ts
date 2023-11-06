import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUsernameAlreadyExists } from 'src/core/decorators';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Validate(IsUsernameAlreadyExists)
  public username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  public email: string;

  @IsOptional()
  @IsString()
  public refreshToken: string;
}
