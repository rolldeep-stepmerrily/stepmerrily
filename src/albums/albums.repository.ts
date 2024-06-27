import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAlbums() {
    try {
      return await this.prismaService.album.findMany({
        where: { deletedAt: null, artist: { deletedAt: null } },
        select: {
          id: true,
          title: true,
          artist: { select: { id: true, name: true } },
          cover: true,
          description: true,
          duration: true,
          releasedAt: true,
        },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
