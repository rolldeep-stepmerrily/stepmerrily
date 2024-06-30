import { Injectable } from '@nestjs/common';

import { PlaylistsRepository } from './playlists.repository';
import { CreatePlaylistDto } from './playlists.dto';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistsRepository: PlaylistsRepository) {}

  async createPlaylist(profileId: number, createPlaylistDto: CreatePlaylistDto) {
    console.log({ profileId, createPlaylistDto });

    //playlist 생성부터
  }
}
