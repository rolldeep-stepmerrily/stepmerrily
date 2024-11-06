import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

import { CustomHttpException } from '@@exceptions';

import {
  CheckEmailForSignUpDto,
  CheckNicknameForSignUpDto,
  CheckPhoneNumberForSignUpDto,
  CheckUsernameForSignUpDto,
  CreateUserDto,
  FindUsernameByEmailDto,
  UpdatePasswordDto,
} from './users.dto';
import { USER_ERRORS } from './users.exception';
import { ICacheDataEmail } from './users.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('SERVER_URL') private readonly serverUrl: string,
  ) {}

  async checkUsernameForSignUp({ username }: CheckUsernameForSignUpDto) {
    const user = await this.usersRepository.findUserByUsername(username);

    if (user) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATED_USERNAME);
    }
  }

  async checkEmailForSignUp({ email }: CheckEmailForSignUpDto) {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATED_EMAIL);
    }
  }

  async checkNicknameForSignUp({ nickname }: CheckNicknameForSignUpDto) {
    const user = await this.usersRepository.findUserByNickname(nickname);

    if (user) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATED_NICKNAME);
    }
  }

  async checkPhoneNumberForSignUp({ phoneNumber }: CheckPhoneNumberForSignUpDto) {
    const user = await this.usersRepository.findUserByPhoneNumber(phoneNumber);

    if (user) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATED_PHONE_NUMBER);
    }
  }

  async createUser({ username, email, password, name, nickname, phoneNumber, terms }: CreateUserDto) {
    if (!terms.isService || !terms.isPrivacy || !terms.isAge) {
      throw new CustomHttpException(USER_ERRORS.INVALID_TERMS);
    }

    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${this.serverUrl}/auth/certification/${email}`);

    if (!cachedData || !cachedData.isCertified) {
      throw new CustomHttpException(USER_ERRORS.UNAUTHORIZED_EMAIL);
    }

    await Promise.all([
      this.checkUsernameForSignUp({ username }),
      this.checkEmailForSignUp({ email }),
      this.checkNicknameForSignUp({ nickname }),
      this.checkPhoneNumberForSignUp({ phoneNumber }),
    ]);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.cacheManager.del(`${this.serverUrl}/users/signup/certification/${email}`);

    return this.usersRepository.createUser({
      username,
      password: hashedPassword,
      name,
      nickname,
      email,
      phoneNumber,
      terms,
    });
  }

  async findUsernameByEmail({ email }: FindUsernameByEmailDto) {
    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${this.serverUrl}/auth/certification/${email}`);

    if (!cachedData || !cachedData.isCertified) {
      throw new CustomHttpException(USER_ERRORS.UNAUTHORIZED_EMAIL);
    }

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new CustomHttpException(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user?.deletedAt) {
      throw new CustomHttpException(USER_ERRORS.WITHDRAWAL_USER);
    }

    return { username: user.username };
  }

  async updatePassword({ username, password }: UpdatePasswordDto) {
    const user = await this.usersRepository.findUserByUsername(username);

    if (!user) {
      throw new CustomHttpException(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.deletedAt) {
      throw new CustomHttpException(USER_ERRORS.WITHDRAWAL_USER);
    }

    const cachedData = await this.cacheManager.get<ICacheDataEmail>(
      `${this.serverUrl}/auth/certification/${user.email}`,
    );

    if (!cachedData || !cachedData.isCertified) {
      throw new CustomHttpException(USER_ERRORS.UNAUTHORIZED_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.updatePassword({ username, password: hashedPassword });
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new CustomHttpException(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.deletedAt) {
      throw new CustomHttpException(USER_ERRORS.WITHDRAWAL_USER);
    }

    return await this.usersRepository.deleteUser(id);
  }

  async createFakeUsers(count: number) {
    return await this.usersRepository.createFakeUsers(count);
  }
}
