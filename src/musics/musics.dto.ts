import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsPositive, IsString } from 'class-validator';

import { Music } from './entities';

export class SearchMusicsDto {
  @ApiProperty({ description: '검색어', example: '한계', required: true })
  @IsString()
  query: string;

  @ApiProperty({ description: '페이지', required: false })
  @IsPositive()
  page?: number = 1;
}

export class CreateMusicDto extends PickType(Music, ['albumId', 'title', 'time', 'isLeadSingle'] as const) {}

export class UpdateMusicDto extends PickType(Music, ['albumId', 'title', 'time', 'isLeadSingle'] as const) {}
