import { BadRequestException, Injectable } from '@nestjs/common';

import { ProfilesRepository } from './profiles.repository';
import { UpdateNicknameDto } from './profiles.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async updateNickname(profileId: number, { nickname }: UpdateNicknameDto) {
    const profile = await this.profilesRepository.findProfile(profileId);

    if (!profile) {
      throw new BadRequestException('유저를 찾을 수 없습니다.');
    }

    if (profile.nickname === nickname) {
      throw new BadRequestException('기존 닉네임과 변경하려는 닉네임이 동일합니다.');
    }

    const isDuplicated = !!(await this.profilesRepository.findProfileByNickname(nickname));

    if (isDuplicated) {
      throw new BadRequestException('이미 사용중인 닉네임입니다.');
    }

    return await this.profilesRepository.updateNickname(profileId, nickname);
  }
}
