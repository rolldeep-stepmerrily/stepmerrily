import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaylistDto } from './playlists.dto';

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
}
