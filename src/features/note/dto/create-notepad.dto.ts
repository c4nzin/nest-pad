import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsValidLength } from 'src/core/decorators';

export class CreateNotepadDto {
  @IsNotEmpty()
  @IsValidLength('title', 3, 100)
  @IsString()
  @ApiProperty()
  public title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MinLength(5)
  public content: string;
}
