import { ApiProperty } from '@nestjs/swagger';

import { Post as PostModel } from '@prisma/client';
import { IsOptional, IsPositive, IsString } from 'class-validator';

import { BaseEntity } from '@@entities';

export class Post extends BaseEntity implements PostModel {
  @ApiProperty({ description: 'ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '유저 ID', minimum: 1, required: true })
  @IsPositive()
  profileId: number;

  @ApiProperty({ description: '제목', required: true, example: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '내용', required: true, example: '내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '이미지', required: false, default: null, example: null })
  @IsOptional()
  @IsString()
  images: string | null;

  @ApiProperty({ description: '조회수', minimum: 0, default: 0 })
  @IsPositive()
  views: number;
}
