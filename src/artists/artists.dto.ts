import { PickType } from '@nestjs/swagger';

import { Artist } from './entities';

export class CreateArtistDto extends PickType(Artist, ['name'] as const) {}

export class UpdateArtistDto extends PickType(Artist, ['name'] as const) {}
