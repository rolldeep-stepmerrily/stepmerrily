import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findArtists() {
    try {
      return await this.prismaService.artist.findMany({
        where: { deletedAt: null },
        select: { id: true, name: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findArtist(artistId: number) {
    try {
      return await this.prismaService.artist.findUnique({
        where: { id: artistId, deletedAt: null },
        select: { id: true, name: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findArtistByName(name: string) {
    try {
      return await this.prismaService.artist.findUnique({
        where: { name },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async createArtist(name: string) {
    try {
      return await this.prismaService.artist.create({
        data: { name },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateArtist(artistId: number, name: string) {
    try {
      return await this.prismaService.artist.update({
        where: { id: artistId },
        data: { name },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteArtist(artistId: number) {
    try {
      return await this.prismaService.artist.update({
        where: { id: artistId },
        data: { deletedAt: dayjs().toISOString() },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
