import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

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
}
