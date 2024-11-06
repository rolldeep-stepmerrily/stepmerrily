import { Injectable } from '@nestjs/common';

import { faker } from '@faker-js/faker/locale/ko';
import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto, UpdatePasswordDto } from './users.dto';

@Injectable()
@CatchDatabaseErrors()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByUsername(username: string) {
    return await this.prismaService.user.findUnique({
      where: { username },
      select: { id: true, email: true, password: true, deletedAt: true },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true, username: true, deletedAt: true },
    });
  }

  async findUserByNickname(nickname: string) {
    return await this.prismaService.profile.findUnique({
      where: { nickname },
      select: { id: true },
    });
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return await this.prismaService.user.findUnique({
      where: { phoneNumber },
      select: { id: true, deletedAt: true },
    });
  }

  async findUserById(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, deletedAt: true, role: true },
    });
  }

  async createUser({ username, email, name, phoneNumber, password, terms, nickname }: CreateUserDto) {
    const { isService, isPrivacy, isPrivacyOption, isAge } = terms;

    return await this.prismaService.user.create({
      data: {
        username,
        email,
        name,
        phoneNumber,
        password,
        term: { create: { isService, isPrivacy, isPrivacyOption, isAge } },
        profile: { create: { nickname } },
      },
      select: { id: true },
    });
  }

  async updatePassword({ username, password }: UpdatePasswordDto) {
    await this.prismaService.user.update({ where: { username, deletedAt: null }, data: { password } });
  }

  async updateUser(id: number) {
    return await this.prismaService.user.update({
      where: { id, deletedAt: null },
      data: { updatedAt: dayjs().toISOString() },
    });
  }

  async deleteUser(id: number) {
    await this.prismaService.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: dayjs().toISOString() },
    });
  }

  async createFakeUsers(count: number) {
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
  }
}
