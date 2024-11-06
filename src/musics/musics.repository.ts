import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@CatchDatabaseErrors()
export class MusicsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findMusics() {
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
      orderBy: { id: 'asc' },
    });
  }

  async searchMusics(query: string) {
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
  }

  async findMusic(musicId: number) {
    return await this.prismaService.music.findUnique({
      where: { id: musicId, deletedAt: null, album: { deletedAt: null, artist: { deletedAt: null } } },
      select: { id: true },
    });
  }

  async createMusic(albumId: number, title: string, duration: number, isLeadSingle: boolean) {
    return await this.prismaService.music.create({
      data: { title, duration, isLeadSingle, album: { connect: { id: albumId } } },
    });
  }

  async updateMusic(musicId: number, albumId: number, title: string, duration: number, isLeadSingle: boolean) {
    return await this.prismaService.music.update({
      where: { id: musicId },
      data: { title, duration, isLeadSingle, album: { connect: { id: albumId } } },
      select: { id: true },
    });
  }

  async deleteMusic(musicId: number) {
    return await this.prismaService.music.update({
      where: { id: musicId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
