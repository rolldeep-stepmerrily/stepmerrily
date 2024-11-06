import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

import { CustomHttpException } from '@@exceptions';

import { CertifyEmailDto, VerifyEmailDto } from 'src/users/users.dto';
import { ICacheDataEmail } from 'src/users/users.interface';
import { UsersRepository } from 'src/users/users.repository';

import { AUTH_ERRORS } from './auth.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject('SERVER_URL') private readonly serverUrl: string,
    @Inject('NODE_ENV') private readonly nodeEnv: string,
    @Inject('JWT_SECRET_KEY') private readonly jwtSecretKey: string,
  ) {}

  async certifyEmail({ email }: CertifyEmailDto) {
    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${this.serverUrl}/auth/certification/${email}`);

    if (cachedData && cachedData.count >= 5) {
      throw new CustomHttpException(AUTH_ERRORS.EXCEED_MAX_AUTH_COUNT);
    }

    const authCode = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0');

    const send = await this.mailerService.sendMail({
      to: email,
      subject: '[stepmerrily] 인증코드 입니다.',
      text: `인증코드 : ${authCode}`,
    });

    const accpetedSends = send?.accepted;

    if (accpetedSends.length !== [email].length) {
      throw new CustomHttpException(AUTH_ERRORS.FAILED_TO_SEND_MAIL);
    }

    const authData: ICacheDataEmail = { authCode, count: (cachedData?.count ?? 0) + 1, isCertified: false };

    await this.cacheManager.set(`${this.serverUrl}/auth/certification/${email}`, authData);
  }

  async verifyEmail({ email, authCode }: VerifyEmailDto) {
    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${this.serverUrl}/auth/certification/${email}`);

    if (!cachedData) {
      throw new CustomHttpException(AUTH_ERRORS.NOT_FOUND_AUTH_INFO);
    }

    if (cachedData?.authCode !== authCode) {
      throw new CustomHttpException(AUTH_ERRORS.INVALID_AUTH_CODE);
    }

    await this.cacheManager.set(`${this.serverUrl}/auth/certification/${email}`, { ...cachedData, isCertified: true });
  }

  async signIn(username: string, password: string) {
    const user = await this.usersRepository.findUserByUsername(username);

    if (!user || user.deletedAt) {
      throw new CustomHttpException(AUTH_ERRORS.WITHDRAWAL_USER);
    }

    const isValidatePassword = await bcrypt.compare(password, user.password);

    if (!isValidatePassword) {
      throw new CustomHttpException(AUTH_ERRORS.INVALID_PASSWORD);
    }

    const { id } = await this.usersRepository.updateUser(user.id);

    const expiresIn = this.nodeEnv === 'production' ? '15m' : '150m';

    return {
      accessToken: this.jwtService.sign({ sub: 'access', id }, { secret: this.jwtSecretKey, expiresIn }),
      refreshToken: this.jwtService.sign({ sub: 'refresh', id }, { secret: this.jwtSecretKey }),
    };
  }

  async createAccessToken(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new CustomHttpException(AUTH_ERRORS.WITHDRAWAL_USER);
    }

    const expiresIn = this.nodeEnv === 'production' ? '15m' : '150m';

    return { accessToken: this.jwtService.sign({ sub: 'access', id }, { secret: this.jwtSecretKey, expiresIn }) };
  }
}
