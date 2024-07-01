import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

import { Artist } from './entities';

export class CreateArtistDto extends PickType(Artist, ['name', 'description'] as const) {}

export class CreateArtistAvatarDto extends Array<Express.Multer.File> {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '아티스트 이미지',
    required: false,
  })
  avatar: Express.Multer.File[];
}

export class CreateArtistWithAvatarDto extends IntersectionType(CreateArtistDto, CreateArtistAvatarDto) {}

export class UpdateArtistDto extends PickType(Artist, ['name', 'description'] as const) {}
