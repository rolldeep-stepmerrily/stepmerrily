import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import bcrypt from 'bcrypt';

import { UsersRepository } from 'src/users/users.repository';
import { VerifyEmailDto } from 'src/users/users.dto';

interface ICacheDataEmail {
  authCode: string;
  count: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async certifyEmail(email: string) {
    try {
      const cachedData = await this.cacheManager.get<ICacheDataEmail>(email);

      if (cachedData && cachedData.count >= 5) {
        throw new UnauthorizedException('인증 횟수 초과');
      }

      const authCode = `${Math.floor(Math.random() * 1000000)}`.padStart(6, '0');

      const send = await this.mailerService.sendMail({
        to: email,
        subject: '[stepmerrily] 인증코드 입니다.',
        text: `인증코드 : ${authCode}`,
      });

      const accpetedSends = send?.accepted;

      if (accpetedSends.length !== [email].length) {
        throw new InternalServerErrorException();
      }

      const authData: ICacheDataEmail = {
        authCode,
        count: (cachedData?.count ?? 0) + 1,
      };

      await this.cacheManager.set(email, authData);
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async verifyEmail({ email, authCode }: VerifyEmailDto) {
    const cachedData = await this.cacheManager.get<ICacheDataEmail>(email);

    if (!cachedData) {
      throw new BadRequestException();
    }

    if (authCode !== cachedData?.authCode) {
      throw new BadRequestException();
    }
  }

  async signIn(username: string, password: string) {
    const user = await this.usersRepository.findUserByUsername(username);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    const isValidatePassword = await bcrypt.compare(password, user.password);

    if (!isValidatePassword) {
      throw new UnauthorizedException();
    }

    const { id } = await this.usersRepository.updateUpdatedAt(user.id);

    const secret = process.env.JWT_SECRET_KEY;

    //TODO : 편의를 위해 100분으로 해놓음, 추후 수정 필요
    return {
      accessToken: this.jwtService.sign({ sub: 'access', id }, { secret, expiresIn: '100m' }),
      refreshToken: this.jwtService.sign({ sub: 'refresh', id }, { secret }),
    };
  }

  async createAccessToken(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    await this.usersRepository.updateUpdatedAt(user.id);

    const secret = process.env.JWT_SECRET;

    //TODO : 편의를 위해 100분으로 해놓음, 추후 수정 필요
    return {
      accessToken: this.jwtService.sign({ sub: 'access', id }, { secret, expiresIn: '100m' }),
    };
  }
}
