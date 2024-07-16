import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import bcrypt from 'bcrypt';

import { UsersRepository } from 'src/users/users.repository';
import { CertifyEmailDto, VerifyEmailDto } from 'src/users/users.dto';
import { ICacheDataEmail } from 'src/users/users.interface';

const { SERVER_URL, NODE_ENV, JWT_SECRET_KEY } = process.env;

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async certifyEmail({ email }: CertifyEmailDto) {
    try {
      const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${SERVER_URL}/auth/certification/${email}`);

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
        throw new InternalServerErrorException('메일 전송 실패');
      }

      const authData: ICacheDataEmail = { authCode, count: (cachedData?.count ?? 0) + 1, isCertified: false };

      await this.cacheManager.set(`${SERVER_URL}/auth/certification/${email}`, authData);
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async verifyEmail({ email, authCode }: VerifyEmailDto) {
    const cachedData = await this.cacheManager.get<ICacheDataEmail>(`${SERVER_URL}/auth/certification/${email}`);

    if (!cachedData) {
      throw new NotFoundException('해당 인증 정보를 찾을 수 없습니다.');
    }

    if (cachedData?.authCode !== authCode) {
      throw new BadRequestException('잘못된 인증 번호 입니다.');
    }

    await this.cacheManager.set(`${SERVER_URL}/auth/certification/${email}`, { ...cachedData, isCertified: true });
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

    const { id } = await this.usersRepository.updateUser(user.id);

    const expiresIn = NODE_ENV === 'production' ? '15m' : '150m';

    return {
      accessToken: this.jwtService.sign({ sub: 'access', id }, { secret: JWT_SECRET_KEY, expiresIn }),
      refreshToken: this.jwtService.sign({ sub: 'refresh', id }, { secret: JWT_SECRET_KEY }),
    };
  }

  async createAccessToken(id: number) {
    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    const expiresIn = NODE_ENV === 'production' ? '15m' : '150m';

    return { accessToken: this.jwtService.sign({ sub: 'access', id }, { secret: JWT_SECRET_KEY, expiresIn }) };
  }
}
