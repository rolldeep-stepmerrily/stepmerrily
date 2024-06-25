import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AlbumsService } from './albums.service';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}
}
