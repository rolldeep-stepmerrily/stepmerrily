import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MusicsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMusics() {
    try {
      return await this.prismaService.music.findMany({
        where: { deletedAt: null, album: { deletedAt: null, artist: { deletedAt: null } } },
        select: {
          id: true,
          title: true,
          album: {
            select: {
              id: true,
              title: true,
              cover: true,
              description: true,
              duration: true,
              releasedAt: true,
              artist: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async searchMusics(query: string) {
    try {
      return await this.prismaService.music.findMany({
        where: { title: { contains: query }, deletedAt: null, album: { deletedAt: null, artist: { deletedAt: null } } },
        select: {
          id: true,
          title: true,
          album: {
            select: {
              id: true,
              title: true,
              cover: true,
              description: true,
              duration: true,
              releasedAt: true,
              artist: { select: { id: true, name: true } },
            },
          },
        },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findMusic(musicId: number) {
    try {
      return await this.prismaService.music.findUnique({
        where: { id: musicId, deletedAt: null, album: { deletedAt: null, artist: { deletedAt: null } } },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
