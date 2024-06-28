import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

import { Album } from './entities';

export class CreateAlbumDto extends PickType(Album, ['artistId', 'title', 'description', 'cover', 'time'] as const) {
  @ApiProperty({ description: '발매일' })
  @IsDateString()
  releasedAt: string | Date;

  duration?: number;
}

export class CreateCoverDto extends Array<Express.Multer.File> {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '앨범 커버 이미지',
    required: true,
  })
  cover: Express.Multer.File;
}

export class CreateAlbumWithCoverDto extends IntersectionType(CreateAlbumDto, CreateCoverDto) {}

export class UpdateAlbumDto extends PickType(Album, ['artistId', 'title', 'description', 'cover', 'time'] as const) {
  @ApiProperty({ description: '발매일' })
  @IsDateString()
  releasedAt: string | Date;

  duration?: number;
}

export class UpdateCoverDto extends Array<Express.Multer.File> {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '앨범 커버 이미지',
    required: true,
  })
  cover: Express.Multer.File;
}

export class UpdateAlbumWithCoverDto extends IntersectionType(UpdateAlbumDto, UpdateCoverDto) {}
