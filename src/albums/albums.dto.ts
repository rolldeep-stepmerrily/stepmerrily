import { PickType } from '@nestjs/swagger';

import { Album } from './entities';

export class CreateAlbumDto extends PickType(Album, [
  'artistId',
  'title',
  'description',
  'cover',
  'time',
  'releasedAt',
] as const) {}
