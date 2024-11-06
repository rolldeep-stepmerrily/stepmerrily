import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreatePlaylistDto, UpdatePlaylistDto } from './playlists.dto';

@Injectable()
@CatchDatabaseErrors()
export class PlaylistsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPlaylist(profileId: number, { name, musicIds }: CreatePlaylistDto) {
    return await this.prismaService.playlist.create({
      data: { name, profile: { connect: { id: profileId } }, musics: { connect: musicIds.map((id) => ({ id })) } },
    });
  }

  async findPlaylists() {
    return await this.prismaService.playlist.findMany({
      where: { deletedAt: null, profile: { deletedAt: null } },
      select: {
        name: true,
        musics: {
          select: {
            id: true,
            title: true,
            duration: true,
            isLeadSingle: true,
            deletedAt: true,
            album: { select: { id: true, title: true, cover: true, artist: { select: { id: true, name: true } } } },
          },
        },
        profile: { select: { id: true, nickname: true, avatar: true } },
      },
    });
  }

  async findPlaylist(playlistId: number) {
    return await this.prismaService.playlist.findUnique({
      where: { id: playlistId, deletedAt: null },
      select: { id: true, profile: { select: { id: true } } },
    });
  }

  async updatePlaylist(playlistId: number, { name, musicIds }: UpdatePlaylistDto) {
    return await this.prismaService.playlist.update({
      where: { id: playlistId },
      data: { name, musics: { set: musicIds.map((id) => ({ id })) } },
      select: { id: true },
    });
  }

  async deletePlaylist(playlistId: number) {
    return await this.prismaService.playlist.update({
      where: { id: playlistId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
