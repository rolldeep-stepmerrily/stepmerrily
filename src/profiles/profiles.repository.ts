import { Injectable } from '@nestjs/common';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateStatusDto } from './profiles.dto';

@Injectable()
@CatchDatabaseErrors()
export class ProfilesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findProfile(profileId: number) {
    return await this.prismaService.profile.findUnique({
      where: { id: profileId, deletedAt: null, user: { deletedAt: null } },
      select: { id: true, nickname: true },
    });
  }

  async findProfileDetail(profileId: number) {
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
        instruments: { select: { id: true, name: true } },
      },
    });
  }

  async findProfileByNickname(nickname: string) {
    return await this.prismaService.profile.findUnique({
      where: { nickname },
      select: { id: true },
    });
  }

  async updateNickname(profileId: number, nickname: string) {
    return await this.prismaService.profile.update({
      where: { id: profileId },
      data: { nickname },
      select: { id: true },
    });
  }

  async updateStatus(profileId: number, { status }: UpdateStatusDto) {
    return await this.prismaService.profile.update({
      where: { id: profileId },
      data: { status },
      select: { id: true },
    });
  }

  async updateAvatar(profileId: number, avatar: string) {
    return await this.prismaService.profile.update({
      where: { id: profileId },
      data: { avatar },
      select: { id: true },
    });
  }

  async updateMusic(profileId: number, musicId: number) {
    return await this.prismaService.profile.update({
      where: { id: profileId },
      data: { musicId },
      select: { id: true },
    });
  }

  async updateInstruments(profileId: number, instrumentIds: number[]) {
    return await this.prismaService.profile.update({
      where: { id: profileId },
      data: {
        instruments: {
          connect: instrumentIds.map((id) => ({ id })),
        },
      },
      select: { id: true },
    });
  }
}
