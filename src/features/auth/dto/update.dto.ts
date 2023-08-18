import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @ApiProperty()
  public refreshToken: string;
}
