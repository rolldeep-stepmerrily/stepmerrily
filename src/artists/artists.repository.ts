import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateArtistDto } from './artists.dto';

@Injectable()
@CatchDatabaseErrors()
export class ArtistsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findLastArtist() {
    return await this.prismaService.artist.findFirst({ orderBy: { id: 'desc' }, select: { id: true } });
  }

  async findArtists() {
    return await this.prismaService.artist.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, description: true, avatar: true },
      orderBy: { id: 'asc' },
    });
  }

  async findArtist(artistId: number) {
    return await this.prismaService.artist.findUnique({
      where: { id: artistId, deletedAt: null },
      select: { id: true, name: true },
    });
  }

  async findArtistByName(name: string) {
    return await this.prismaService.artist.findUnique({ where: { name }, select: { id: true } });
  }

  async createArtist(name: string, description: string | null, avatar: string | null = null) {
    return await this.prismaService.artist.create({ data: { name, description, avatar }, select: { id: true } });
  }

  async updateArtist(artistId: number, updateArtistDto: UpdateArtistDto) {
    return await this.prismaService.artist.update({
      where: { id: artistId },
      data: { ...updateArtistDto },
      select: { id: true },
    });
  }

  async deleteArtist(artistId: number) {
    return await this.prismaService.artist.update({
      where: { id: artistId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
