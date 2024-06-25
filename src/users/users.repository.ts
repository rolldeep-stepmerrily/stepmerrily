import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { faker } from '@faker-js/faker/locale/ko';
import dayjs from 'dayjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdatePasswordDto } from './users.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByUsername(username: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { username },
        select: { id: true, email: true, password: true, deletedAt: true },
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
      return await this.prismaService.profile.findUnique({
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
        select: { id: true, deletedAt: true, role: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async createUser({ username, email, name, phoneNumber, password, terms, nickname }: CreateUserDto) {
    try {
      const { isService, isPrivacy, isPrivacyOption, isAge } = terms;

      return await this.prismaService.user.create({
        data: {
          username,
          email,
          name,
          phoneNumber,
          password,
          term: {
            create: { isService, isPrivacy, isPrivacyOption, isAge },
          },
          profile: {
            create: { nickname },
          },
        },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updatePassword({ username, password }: UpdatePasswordDto) {
    try {
      await this.prismaService.user.update({
        where: { username, deletedAt: null },
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
        where: { id, deletedAt: null },
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
        where: { id, deletedAt: null },
        data: { deletedAt: dayjs().toISOString() },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async createFakeUsers(count: number) {
    try {
      const queries = new Array(count).fill(null).map(() => {
        return this.prismaService.user.create({
          data: {
            username: faker.internet.userName().substring(0, 16),
            email: faker.internet.email(),
            name: faker.person.lastName() + faker.person.firstName(),
            phoneNumber: faker.phone.number().replaceAll('-', ''),
            password: faker.internet.password({ length: 32 }),
            term: {
              create: { isAge: true, isPrivacy: true, isService: true, isPrivacyOption: faker.datatype.boolean() },
            },
            profile: { create: { nickname: faker.music.songName().replaceAll(' ', '').substring(0, 6) } },
          },
          include: { term: true },
        });
      });

      return await this.prismaService.$transaction(queries);
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
