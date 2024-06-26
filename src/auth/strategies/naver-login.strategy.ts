import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import axios from 'axios';

const getProfileUrl = 'https://openapi.naver.com/v1/nid/me';

@Injectable()
export class NaverLoginStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({});
  }

  async validate(naverAccessToken: string) {
    try {
      const headers = {
        Host: 'openapi.naver.com',
        Pragma: 'no-cache',
        Accept: '*/*',
        Authorization: `bearer ${naverAccessToken}`,
      };

      const getProfileResult = await axios.get(getProfileUrl, { headers });

      const profile = getProfileResult.data.response;

      profile.accessToken = naverAccessToken;

      return profile;
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
