import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUsernameAlreadyExists } from 'src/core/decorators';
import { Expose, Exclude } from 'class-transformer';

export const USER_DETAILS = 'user_details';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Validate(IsUsernameAlreadyExists)
  public username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose({ groups: [USER_DETAILS] })
  public password: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  public email: string;

  @IsOptional()
  @IsString()
  @Exclude()
  public refreshToken: string;
}
