import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PlaylistsService } from './playlists.service';
import { User } from 'src/auth/decorators';
import { CreatePlaylistDto } from './playlists.dto';

@ApiTags('Playlists')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @ApiOperation({ summary: '플레이리스트 등록' })
  @Post()
  async createPlaylist(@User('id') profileId: number, @Body() createPlaylistDto: CreatePlaylistDto) {
    await this.playlistsService.createPlaylist(profileId, createPlaylistDto);
  }
}
