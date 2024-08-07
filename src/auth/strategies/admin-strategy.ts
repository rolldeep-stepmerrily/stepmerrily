import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersRepository } from 'src/users/users.repository';

interface IValidate {
  sub: string;
  id: number;
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate({ sub, id }: IValidate) {
    if (sub !== 'access') {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findUserById(id);

    if (user?.role !== 'ADMIN') {
      throw new UnauthorizedException();
    }

    return user;
  }
}
