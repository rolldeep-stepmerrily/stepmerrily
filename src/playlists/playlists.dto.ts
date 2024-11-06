import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsArray, IsPositive } from 'class-validator';

import { Playlist } from './entities';

export class CreatePlaylistDto extends PickType(Playlist, ['name'] as const) {
  @ApiProperty({ description: '뮤직 ID', minimum: 1, example: [1, 2, 3] })
  @IsArray()
  @IsPositive({ each: true })
  musicIds: number[];
}

export class UpdatePlaylistDto extends PickType(Playlist, ['name'] as const) {
  @ApiProperty({ description: '뮤직 ID', minimum: 1, example: [1, 2, 3] })
  @IsArray()
  @IsPositive({ each: true })
  musicIds: number[];
}
