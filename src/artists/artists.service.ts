import { Injectable } from '@nestjs/common';

import { ArtistsRepository } from './artists.repository';

@Injectable()
export class ArtistsService {
  constructor(private readonly artistsRepository: ArtistsRepository) {}
}
