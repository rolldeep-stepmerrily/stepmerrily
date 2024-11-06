import { ApiProperty } from '@nestjs/swagger';

import { Music as MusicModel } from '@prisma/client';
import { IsBoolean, IsPositive, IsString, Matches } from 'class-validator';

import { BaseEntity } from '@@entities';

export class Music extends BaseEntity implements MusicModel {
  @ApiProperty({ description: '음악 ID' })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '앨범 ID', required: true })
  @IsPositive()
  albumId: number;

  @ApiProperty({ description: '제목', required: true })
  @IsString()
  title: string;

  duration: number;

  @ApiProperty({ description: '타이틀곡 여부', required: true, default: false })
  @IsBoolean()
  isLeadSingle: boolean;

  @ApiProperty({ description: '재생 시간', required: true, example: '00:00:00' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, { message: 'HH:mm:ss 형식을 맞춰주세요.' })
  time: string;
}
