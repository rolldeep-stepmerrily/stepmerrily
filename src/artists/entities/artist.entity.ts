import { ApiProperty } from '@nestjs/swagger';

import { Artist as ArtistModel } from '@prisma/client';
import { IsOptional, IsPositive, IsString } from 'class-validator';

import { BaseEntity } from '@@entities';

export class Artist extends BaseEntity implements ArtistModel {
  @ApiProperty({ description: '아티스트 ID', example: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '아티스트 이름', example: 'Jazzyfact', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '아티스트 이미지', required: false })
  @IsOptional()
  @IsString()
  avatar: string | null;

  @ApiProperty({
    description: '아티스트 ',
    example: 'Jazzyfact는 2010년에 결성된 대한민국의 힙합 듀오이다.',
    required: false,
  })
  @IsString()
  description: string | null;
}
