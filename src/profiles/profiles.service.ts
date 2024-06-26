import { BadRequestException, Injectable } from '@nestjs/common';

import { ProfilesRepository } from './profiles.repository';
import { UpdateAvatarDto, UpdateNicknameDto, UpdateStatusDto } from './profiles.dto';
import { AwsService } from 'src/aws/aws.service';

const { AWS_CLOUDFRONT_DOMAIN } = process.env;

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly awsService: AwsService,
  ) {}

  async findProfile(profileId: number) {
    return await this.profilesRepository.findProfile(profileId);
  }

  async findProfileDetail(profileId: number) {
    const profile = await this.profilesRepository.findProfileDetail(profileId);

    if (!profile) {
      throw new BadRequestException('유저를 찾을 수 없습니다.');
    }

    const avatars = profile.avatar ? await this.awsService.findImages(profile.avatar) : null;

    const avatar = avatars ? `${AWS_CLOUDFRONT_DOMAIN}/${avatars[avatars.length - 1].Key}` : null;

    return { ...profile, avatar };
  }

  async updateNickname(profileId: number, { nickname }: UpdateNicknameDto) {
    const profile = await this.findProfile(profileId);

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

  async updateStatus(profileId: number, updateStatusDto: UpdateStatusDto) {
    const profile = await this.findProfile(profileId);

    if (!profile) {
      throw new BadRequestException('유저를 찾을 수 없습니다.');
    }

    return await this.profilesRepository.updateStatus(profileId, updateStatusDto);
  }

  async updateAvatar(profileId: number, updateAvatarDto: UpdateAvatarDto) {
    const profile = await this.findProfile(profileId);

    if (!profile) {
      throw new BadRequestException('유저를 찾을 수 없습니다.');
    }

    const uploadPath = `users/${profileId}/profiles/avatar`;

    await this.awsService.uploadImages(updateAvatarDto, uploadPath);

    return await this.profilesRepository.updateAvatar(profileId, uploadPath);
  }
}
