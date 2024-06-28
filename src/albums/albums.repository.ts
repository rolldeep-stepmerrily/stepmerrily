import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAlbumDto, UpdateAlbumDto } from './albums.dto';
import dayjs from 'dayjs';

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

  async findLastAlbum() {
    try {
      return await this.prismaService.album.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findAlbum(albumId: number) {
    try {
      return await this.prismaService.album.findUnique({
        where: { id: albumId, deletedAt: null, artist: { deletedAt: null } },
        select: { id: true, cover: true },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async createAlbum({ artistId, title, description, duration, cover, releasedAt }: CreateAlbumDto) {
    try {
      return await this.prismaService.album.create({
        data: { artist: { connect: { id: artistId } }, title, description, duration, cover, releasedAt },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateAlbum(albumId: number, { artistId, title, description, duration, cover, releasedAt }: UpdateAlbumDto) {
    try {
      return await this.prismaService.album.update({
        where: { id: albumId },
        data: { artist: { connect: { id: artistId } }, title, description, duration, cover, releasedAt },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteAlbum(albumId: number) {
    try {
      return await this.prismaService.album.update({
        where: { id: albumId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
