import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PlaylistsService } from './playlists.service';
import { User } from 'src/auth/decorators';
import { CreatePlaylistDto, UpdatePlaylistDto } from './playlists.dto';

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

  @ApiOperation({ summary: '플레이리스트 조회' })
  @Get()
  async findPlaylists() {
    return await this.playlistsService.findPlaylists();
  }

  @ApiOperation({ summary: '플레이리스트 수정' })
  @Put(':id')
  async updatePlaylist(
    @User('id') profileId: number,
    @Param('id') playlistId: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    await this.playlistsService.updatePlaylist(profileId, playlistId, updatePlaylistDto);
  }

  @ApiOperation({ summary: '플레이리스트 삭제' })
  @Delete(':id')
  async deletePlaylist(@User('id') profileId: number, @Param('id') playlistId: number) {
    await this.playlistsService.deletePlaylist(profileId, playlistId);
  }
}
