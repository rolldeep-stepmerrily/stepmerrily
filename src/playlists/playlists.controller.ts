import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PlaylistsService } from './playlists.service';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}
}
