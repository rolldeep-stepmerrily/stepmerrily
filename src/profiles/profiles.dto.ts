import { ApiProperty, PickType } from '@nestjs/swagger';

import { Profile } from './entities';
import { IsArray, IsPositive } from 'class-validator';

export class UpdateNicknameDto extends PickType(Profile, ['nickname'] as const) {}

export class UpdateStatusDto extends PickType(Profile, ['status'] as const) {}

export class UpdateAvatarDto extends Array<Express.Multer.File> {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '프로필 아바타',
    required: true,
  })
  avatar: Express.Multer.File;
}

export class UpdateMusicDto extends PickType(Profile, ['musicId'] as const) {}

export class UpdateInstrumentsDto {
  @ApiProperty({ description: '악기 ID', example: [1, 2, 3], required: true })
  @IsArray()
  @IsPositive({ each: true })
  instrumentIds: number[];
}
