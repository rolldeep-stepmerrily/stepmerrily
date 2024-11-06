import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';

@Injectable()
@CatchDatabaseErrors()
export class AlbumsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAlbums() {
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
  }

  async findLastAlbum() {
    return await this.prismaService.album.findFirst({ orderBy: { id: 'desc' }, select: { id: true } });
  }

  async findAlbum(albumId: number) {
    return await this.prismaService.album.findUnique({
      where: { id: albumId, deletedAt: null, artist: { deletedAt: null } },
      select: { id: true, cover: true },
    });
  }

  async createAlbum({ artistId, title, description, duration, cover, releasedAt }: CreateAlbumDto) {
    return await this.prismaService.album.create({
      data: { artist: { connect: { id: artistId } }, title, description, duration, cover, releasedAt },
      select: { id: true },
    });
  }

  async updateAlbum(albumId: number, { artistId, title, description, duration, cover, releasedAt }: UpdateAlbumDto) {
    return await this.prismaService.album.update({
      where: { id: albumId },
      data: { artist: { connect: { id: artistId } }, title, description, duration, cover, releasedAt },
      select: { id: true },
    });
  }

  async deleteAlbum(albumId: number) {
    return await this.prismaService.album.update({
      where: { id: albumId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
