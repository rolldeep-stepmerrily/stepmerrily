import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import bcrypt from 'bcrypt';

import { UsersRepository } from './users.repository';
import {
  CheckEmailForSignUpDto,
  CheckNicknameForSignUpDto,
  CheckPhoneNumberForSignUpDto,
  CheckUsernameForSignUpDto,
  CreateUserDto,
  FindUsernameByEmailDto,
  UpdatePasswordDto,
} from './users.dto';
import { ICacheDataEmail } from './users.interface';

const { SERVER_URL } = process.env;

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async checkUsernameForSignUp({ username }: CheckUsernameForSignUpDto) {
    const user = await this.usersRepository.findUserByUsername(username);

    if (user) {
      throw new ConflictException('이미 존재하는 아이디 입니다.');
    }
  }
  async checkEmailForSignUp({ email }: CheckEmailForSignUpDto) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      throw new ConflictException('해당 이메일로 가입된 계정이 존재합니다.');
    }
  }

  async checkNicknameForSignUp({ nickname }: CheckNicknameForSignUpDto) {
    const user = await this.usersRepository.findUserByNickname(nickname);

    if (user) {
      throw new ConflictException('해당 닉네임으로 가입된 계정이 존재합니다.');
    }
  }

  async checkPhoneNumberForSignUp({ phoneNumber }: CheckPhoneNumberForSignUpDto) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (user) {
      throw new ConflictException('해당 전화번로 가입된 계정이 존재합니다.');
    }
  }

  async createUser({ username, email, password, name, nickname, phoneNumber }: CreateUserDto) {
    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${SERVER_URL}/auth/certification/${email}`);

    if (!cachedData || !cachedData.isCertified) {
      throw new BadRequestException('이메일 인증을 진행해주세요.');
    }

    await Promise.all([
      this.checkUsernameForSignUp({ username }),
      this.checkEmailForSignUp({ email }),
      this.checkNicknameForSignUp({ nickname }),
      this.checkPhoneNumberForSignUp({ phoneNumber }),
    ]);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.cacheManager.del(`${SERVER_URL}/users/signup/certification/${email}`);

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
    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${SERVER_URL}/auth/certification/${email}`);

    if (!cachedData || !cachedData.isCertified) {
      throw new BadRequestException('이메일 인증을 진행해주세요.');
    }

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('해당 이메일로 가입된 계정이 없습니다.');
    }

    if (user?.deletedAt) {
      throw new BadRequestException('탈퇴한 회원입니다.');
    }

    return { username: user.username };
  }

  async updatePassword({ username, password }: UpdatePasswordDto) {
    const user = await this.usersRepository.findUserByUsername(username);

    if (!user) {
      throw new NotFoundException('해당 회원을 찾을 수 없습니다.');
    }

    if (user.deletedAt) {
      throw new BadRequestException('탈퇴한 회원입니다.');
    }

    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${SERVER_URL}/auth/certification/${user.email}`);

    if (!cachedData || !cachedData.isCertified) {
      throw new BadRequestException('이메일 인증을 진행해주세요.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.updatePassword({ username, password: hashedPassword });
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new BadRequestException('해당 회원을 찾을 수 없습니다.');
    }

    if (user.deletedAt) {
      throw new BadRequestException('이미 탈퇴한 회원입니다.');
    }

    return await this.usersRepository.deleteUser(id);
  }
}
