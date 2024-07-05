import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { ProfilesRepository } from './profiles.repository';
import {
  UpdateAvatarDto,
  UpdateInstrumentsDto,
  UpdateMusicDto,
  UpdateNicknameDto,
  UpdateStatusDto,
} from './profiles.dto';
import { AwsService } from 'src/aws/aws.service';
import { MusicsService } from 'src/musics/musics.service';
import { InstrumentsService } from 'src/instruments/instruments.service';

const { AWS_CLOUDFRONT_DOMAIN } = process.env;

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly awsService: AwsService,
    private readonly musicService: MusicsService,
    private readonly instrumentsService: InstrumentsService,
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

    const formattedMusic = profile.music
      ? {
          ...profile.music,
          duration: dayjs.duration(profile.music.duration, 'seconds').format('HH:mm:ss'),
        }
      : null;

    return { ...profile, avatar, music: formattedMusic };
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
    return await this.profilesRepository.updateStatus(profileId, updateStatusDto);
  }

  async updateAvatar(profileId: number, updateAvatarDto: UpdateAvatarDto) {
    const uploadPath = `users/${profileId}/profiles/avatar`;

    await this.awsService.uploadImages(updateAvatarDto, uploadPath);

    return await this.profilesRepository.updateAvatar(profileId, uploadPath);
  }

  async updateMusic(profileId: number, { musicId }: UpdateMusicDto) {
    const music = await this.musicService.findMusic(musicId);

    if (!music) {
      throw new BadRequestException('음악을 찾을 수 없습니다.');
    }

    return await this.profilesRepository.updateMusic(profileId, musicId);
  }

  async updateInstruments(profileId: number, { instrumentIds }: UpdateInstrumentsDto) {
    const instruments = await this.instrumentsService.findInstrumentsByIds(instrumentIds);

    if (instruments.length !== instrumentIds.length) {
      throw new NotFoundException('악기를 찾을 수 없습니다.');
    }

    return await this.profilesRepository.updateInstruments(profileId, instrumentIds);
  }
}
