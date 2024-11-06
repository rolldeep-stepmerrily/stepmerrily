import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { CustomHttpException } from '@@exceptions';

import { UsersRepository } from 'src/users/users.repository';

import { AUTH_ERRORS } from '../auth.exception';

interface IValidate {
  sub: string;
  id: number;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
  }

  async validate({ sub, id }: IValidate) {
    if (sub !== 'refresh') {
      throw new CustomHttpException(AUTH_ERRORS.FORBIDDEN_REQUEST);
    }

    const user = await this.usersRepository.findUserById(id);

    if (!user || user.deletedAt) {
      throw new CustomHttpException(AUTH_ERRORS.WITHDRAWAL_USER);
    }

    return user;
  }
}
