import { ApiProperty } from '@nestjs/swagger';

import { Profile as ProfileModel } from '@prisma/client';
import { IsOptional, IsPositive, IsString, Matches } from 'class-validator';

import { BaseEntity } from '@@entities';

export class Profile extends BaseEntity implements ProfileModel {
  @ApiProperty({ description: '프로필 ID', example: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ required: true, description: '닉네임', example: '롤딥' })
  @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/, { message: 'nickname must be a nickname' })
  nickname: string;

  @ApiProperty({ description: '아바타', required: false })
  @IsOptional()
  @IsString()
  avatar: string | null;

  @ApiProperty({ description: '상태 메시지', required: true, example: 'hello world!' })
  @IsOptional()
  @IsString()
  status: string | null;

  @ApiProperty({ description: '가장 좋아하는 음악 ID', required: true })
  @IsPositive()
  musicId: number;
}
