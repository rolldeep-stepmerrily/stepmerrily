import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './users.dto';
import dayjs from 'dayjs';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByUsername(username: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { username },
        select: { id: true, password: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { email },
        select: { id: true, username: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findUserByNickname(nickname: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { nickname },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { phoneNumber },
        select: { id: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findUserById(id: number) {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
        select: { id: true, deletedAt: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: createUserDto,
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updatePassword(email: string, password: string) {
    try {
      await this.prismaService.user.update({
        where: { email },
        data: { password },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: number) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: { updatedAt: dayjs().toISOString() },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: number) {
    try {
      await this.prismaService.user.update({
        where: { id },
        data: { deletedAt: dayjs().toISOString() },
      });
    } catch (e) {
      console.log(e);

      throw new InternalServerErrorException();
    }
  }
}
