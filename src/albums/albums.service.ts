import { Injectable } from '@nestjs/common';

import { AlbumsRepository } from './albums.repository';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumsRepository: AlbumsRepository) {}
}
