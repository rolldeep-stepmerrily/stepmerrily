import { ApiProperty } from '@nestjs/swagger';
import { Album as AlbumModel } from '@prisma/client';
import { IsOptional, IsPositive, IsString, Matches } from 'class-validator';

import { Common } from 'src/common/entities';

export class Album extends Common implements AlbumModel {
  @ApiProperty({ description: '앨범 ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '아티스트 ID', minimum: 1 })
  @IsPositive()
  artistId: number;

  @ApiProperty({ description: '앨범 제목', example: 'Healing Process' })
  @IsString()
  title: string;

  @ApiProperty({ description: '앨범 설명', example: '힐링 프로세스', required: false, nullable: true })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty({ description: '앨범 커버', required: false, nullable: true })
  @IsOptional()
  @IsString()
  cover: string | null;

  duration: number;

  releasedAt: Date;

  @ApiProperty({ description: '재생 시간', required: true, example: '00:00:00' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, { message: 'HH:mm:ss 형식을 맞춰주세요.' })
  time: string;
}
