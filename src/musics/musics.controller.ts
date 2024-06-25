import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MusicsService } from './musics.service';

@ApiTags('Musics')
@Controller('musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}
}
