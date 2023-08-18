import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsEmail()
  @ApiProperty()
  public email: string;

  @IsOptional()
  public refreshToken: string;
}
