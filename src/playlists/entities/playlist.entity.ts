import { ApiProperty } from '@nestjs/swagger';
import { Playlist as PlaylistModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class Playlist extends Common implements PlaylistModel {
  @ApiProperty({ description: '플레이리스트 ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '프로필 ID', minimum: 1 })
  @IsPositive()
  profileId: number;

  @ApiProperty({ description: '플레이리스트 이름' })
  @IsString()
  name: string;
}
