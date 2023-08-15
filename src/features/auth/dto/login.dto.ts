import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(3)
  public password: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
