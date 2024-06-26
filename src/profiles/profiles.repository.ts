import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateStatusDto } from './profiles.dto';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findProfile(profileId: number) {
    try {
      return await this.prismaService.profile.findUnique({
        where: { id: profileId, deletedAt: null, user: { deletedAt: null } },
        select: { id: true, nickname: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findProfileDetail(profileId: number) {
    try {
      return await this.prismaService.profile.findUnique({
        where: { id: profileId, deletedAt: null, user: { deletedAt: null } },
        select: {
          id: true,
          nickname: true,
          avatar: true,
          status: true,
          music: {
            where: { deletedAt: null, album: { deletedAt: null, artist: { deletedAt: null } } },
            select: {
              id: true,
              title: true,
              duration: true,
              album: {
                select: {
                  id: true,
                  title: true,
                  cover: true,
                  artist: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findProfileByNickname(nickname: string) {
    try {
      return await this.prismaService.profile.findUnique({
        where: { nickname },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateNickname(profileId: number, nickname: string) {
    try {
      return await this.prismaService.profile.update({
        where: { id: profileId },
        data: { nickname },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateStatus(profileId: number, { status }: UpdateStatusDto) {
    try {
      return await this.prismaService.profile.update({
        where: { id: profileId },
        data: { status },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateAvatar(profileId: number, avatar: string) {
    try {
      return await this.prismaService.profile.update({
        where: { id: profileId },
        data: { avatar },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateMusic(profileId: number, musicId: number) {
    try {
      return await this.prismaService.profile.update({
        where: { id: profileId },
        data: { musicId },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}
