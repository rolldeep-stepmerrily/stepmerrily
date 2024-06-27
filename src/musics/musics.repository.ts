import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';

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

  async createMusic(albumId: number, title: string, duration: number, isLeadSingle: boolean) {
    try {
      return await this.prismaService.music.create({
        data: { title, duration, isLeadSingle, album: { connect: { id: albumId } } },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateMusic(musicId: number, albumId: number, title: string, duration: number, isLeadSingle: boolean) {
    try {
      return await this.prismaService.music.update({
        where: { id: musicId },
        data: { title, duration, isLeadSingle, album: { connect: { id: albumId } } },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteMusic(musicId: number) {
    try {
      return await this.prismaService.music.update({
        where: { id: musicId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
