import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { PlaylistsRepository } from './playlists.repository';
import { CreatePlaylistDto, UpdatePlaylistDto } from './playlists.dto';
import { AwsService } from 'src/aws/aws.service';

const { AWS_CLOUDFRONT_DOMAIN } = process.env;

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly playlistsRepository: PlaylistsRepository,
    private readonly awsService: AwsService,
  ) {}

  async createPlaylist(profileId: number, createPlaylistDto: CreatePlaylistDto) {
    await this.playlistsRepository.createPlaylist(profileId, createPlaylistDto);
  }

  async findPlaylists() {
    const findPlaylists = await this.playlistsRepository.findPlaylists();

    const playlistsAsync = findPlaylists.map(async (playlist) => {
      const avatars = playlist.profile.avatar ? await this.awsService.findImages(playlist.profile.avatar) : null;

      const avatar = avatars ? `${AWS_CLOUDFRONT_DOMAIN}/${avatars[avatars.length - 1].Key}` : null;

      let duration = 0;

      const coversAndCalcDurationAsync = playlist.musics.map(async (music) => {
        duration += music.duration;

        const covers = music.album.cover ? await this.awsService.findImages(music.album.cover) : null;

        return covers ? `${AWS_CLOUDFRONT_DOMAIN}/${covers[covers.length - 1].Key}` : null;
      });

      const cover = await Promise.all(coversAndCalcDurationAsync);

      const formattedDuration = dayjs.duration(duration, 'seconds').format('HH:mm:ss');

      return {
        ...playlist,
        profile: { ...playlist.profile, avatar },
        musics: playlist.musics.map((music, index) => ({ ...music, cover: cover[index] })),
        duration: formattedDuration,
      };
    });

    const playlists = await Promise.all(playlistsAsync);

    return { playlists };
  }

  async findPlaylist(playlistId: number) {
    return await this.playlistsRepository.findPlaylist(playlistId);
  }

  async updatePlaylist(profileId: number, playlistId: number, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.findPlaylist(playlistId);

    if (!playlist) {
      throw new NotFoundException('플레이리스트를 찾을 수 없습니다.');
    }

    if (playlist.profile.id !== profileId) {
      throw new BadRequestException('플레이리스트 생성자만 수정할 수 있습니다.');
    }

    return await this.playlistsRepository.updatePlaylist(profileId, updatePlaylistDto);
  }

  async deletePlaylist(profileId: number, playlistId: number) {
    const playlist = await this.findPlaylist(playlistId);

    if (!playlist) {
      throw new NotFoundException('플레이리스트를 찾을 수 없습니다.');
    }

    if (playlist.profile.id !== profileId) {
      throw new BadRequestException('플레이리스트 생성자만 삭제할 수 있습니다.');
    }

    return await this.playlistsRepository.deletePlaylist(playlistId);
  }
}
