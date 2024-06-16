import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import { AwsService } from 'src/aws/aws.service';
import { CreateUserDto, FindUsernameByEmailDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly awsService: AwsService,
  ) {}

  async checkUsernameForSignUp(username: string) {
    const user = await this.usersRepository.findUserByUsername(username);

    if (user) {
      throw new ConflictException();
    }
  }
  async checkEmailForSignUp(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      throw new ConflictException();
    }
  }

  async checkNicknameForSignUp(nickname: string) {
    const user = await this.usersRepository.findUserByNickname(nickname);

    if (user) {
      throw new ConflictException();
    }
  }

  async checkPhoneNumberForSignUp(phoneNumber: string) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (user) {
      throw new ConflictException();
    }
  }

  async createUser({ username, email, password, name, nickname, phoneNumber }: CreateUserDto) {
    await Promise.all([
      this.checkUsernameForSignUp(username),
      this.checkEmailForSignUp(email),
      this.checkNicknameForSignUp(nickname),
      this.checkPhoneNumberForSignUp(phoneNumber),
    ]);

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersRepository.createUser({
      username,
      password: hashedPassword,
      name,
      nickname,
      email,
      phoneNumber,
    });
  }

  async findUsernameByEmail({ email }: FindUsernameByEmailDto) {
    return this.usersRepository.findUserByEmail(email);
  }

  async updatePassword(email: string, passwrod: string) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (!user || user.deletedAt) {
      throw new BadRequestException();
    }

    const hashedPassword = await bcrypt.hash(passwrod, 10);

    await this.usersRepository.updatePassword(email, hashedPassword);
  }

  async updateDeletedAt(id: number) {
    return await this.usersRepository.updateDeletedAt(id);
  }
}
