import { ApiProperty } from '@nestjs/swagger';
import { Artist as ArtistModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class Artist extends Common implements ArtistModel {
  @ApiProperty({ description: '아티스트 ID', example: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '아티스트 이름', example: 'Jazzyfact', required: true })
  @IsString()
  name: string;
}
