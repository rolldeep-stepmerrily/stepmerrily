import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaylistDto, UpdatePlaylistDto } from './playlists.dto';
import dayjs from 'dayjs';

@Injectable()
export class PlaylistsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPlaylist(profileId: number, { name, musicIds }: CreatePlaylistDto) {
    try {
      return await this.prismaService.playlist.create({
        data: { name, profile: { connect: { id: profileId } }, musics: { connect: musicIds.map((id) => ({ id })) } },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findPlaylists() {
    try {
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
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findPlaylist(playlistId: number) {
    try {
      return await this.prismaService.playlist.findUnique({
        where: { id: playlistId, deletedAt: null },
        select: { id: true, profile: { select: { id: true } } },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updatePlaylist(playlistId: number, { name, musicIds }: UpdatePlaylistDto) {
    try {
      return await this.prismaService.playlist.update({
        where: { id: playlistId },
        data: { name, musics: { set: musicIds.map((id) => ({ id })) } },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deletePlaylist(playlistId: number) {
    try {
      return await this.prismaService.playlist.update({
        where: { id: playlistId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
