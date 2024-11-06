import { Inject, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { CustomHttpException } from '@@exceptions';

import { AwsService } from 'src/aws/aws.service';
import { InstrumentsService } from 'src/instruments/instruments.service';
import { MusicsService } from 'src/musics/musics.service';

import {
  UpdateAvatarDto,
  UpdateInstrumentsDto,
  UpdateMusicDto,
  UpdateNicknameDto,
  UpdateStatusDto,
} from './profiles.dto';
import { PROFILE_ERRORS } from './profiles.exception';
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly awsService: AwsService,
    private readonly musicService: MusicsService,
    private readonly instrumentsService: InstrumentsService,
    @Inject('AWS_CLOUDFRONT_DOMAIN') private readonly awsCloudfrontDomain: string,
  ) {}

  async findProfile(profileId: number) {
    return await this.profilesRepository.findProfile(profileId);
  }

  async findProfileDetail(profileId: number) {
    const profile = await this.profilesRepository.findProfileDetail(profileId);

    if (!profile) {
      throw new CustomHttpException(PROFILE_ERRORS.PROFILE_NOT_FOUND);
    }

    const avatars = profile.avatar ? await this.awsService.findImages(profile.avatar) : null;

    const avatar = avatars ? `${this.awsCloudfrontDomain}/${avatars[avatars.length - 1].Key}` : null;

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
      throw new CustomHttpException(PROFILE_ERRORS.PROFILE_NOT_FOUND);
    }

    if (profile.nickname === nickname) {
      throw new CustomHttpException(PROFILE_ERRORS.NICKNAME_UNCHANGED);
    }

    const isDuplicated = !!(await this.profilesRepository.findProfileByNickname(nickname));

    if (isDuplicated) {
      throw new CustomHttpException(PROFILE_ERRORS.DUPLICATED_NICKNAME);
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
      throw new CustomHttpException(PROFILE_ERRORS.MUSIC_NOT_FOUND);
    }

    return await this.profilesRepository.updateMusic(profileId, musicId);
  }

  async updateInstruments(profileId: number, { instrumentIds }: UpdateInstrumentsDto) {
    const instruments = await this.instrumentsService.findInstrumentsByIds(instrumentIds);

    if (instruments.length !== instrumentIds.length) {
      throw new CustomHttpException(PROFILE_ERRORS.INSTRUMENT_NOT_FOUND);
    }

    return await this.profilesRepository.updateInstruments(profileId, instrumentIds);
  }
}
