import { ApiProperty, PickType } from '@nestjs/swagger';

import { Profile } from './entities';

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
