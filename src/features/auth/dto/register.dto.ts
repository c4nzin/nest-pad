import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @MaxLength(15)
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  public username: string;

  @ApiProperty()
  @MaxLength(15)
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  public password: string;

  @IsEmail()
  @ApiProperty()
  public email: string;
}
