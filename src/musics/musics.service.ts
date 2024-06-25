import { Injectable } from '@nestjs/common';

import { MusicsRepository } from './musics.repository';

@Injectable()
export class MusicsService {
  constructor(private readonly musicsRepository: MusicsRepository) {}
}
