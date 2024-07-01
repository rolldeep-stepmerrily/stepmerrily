import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPlaylist() {}

  async findPlaylists() {
    try {
      return await this.prismaService.playlist.findMany({
        where: { deletedAt: null, profile: { deletedAt: null } },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
