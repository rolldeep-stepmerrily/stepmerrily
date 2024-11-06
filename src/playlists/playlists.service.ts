import { Inject, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { CustomHttpException } from '@@exceptions';

import { AwsService } from 'src/aws/aws.service';

import { CreatePlaylistDto, UpdatePlaylistDto } from './playlists.dto';
import { PLAYLIST_ERRORS } from './playlists.exception';
import { PlaylistsRepository } from './playlists.repository';

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly playlistsRepository: PlaylistsRepository,
    private readonly awsService: AwsService,
    @Inject('AWS_CLOUDFRONT_DOMAIN') private readonly awsCloudfrontDomain: string,
  ) {}

  async createPlaylist(profileId: number, createPlaylistDto: CreatePlaylistDto) {
    await this.playlistsRepository.createPlaylist(profileId, createPlaylistDto);
  }

  async findPlaylists() {
    const findPlaylists = await this.playlistsRepository.findPlaylists();

    const playlistsAsync = findPlaylists.map(async (playlist) => {
      const avatars = playlist.profile.avatar ? await this.awsService.findImages(playlist.profile.avatar) : null;

      const avatar = avatars ? `${this.awsCloudfrontDomain}/${avatars[avatars.length - 1].Key}` : null;

      let duration = 0;

      const covers = await Promise.all(
        playlist.musics.map(async (music) => {
          duration += music.duration;

          const covers = music.album.cover ? await this.awsService.findImages(music.album.cover) : null;

          return covers ? `${this.awsCloudfrontDomain}/${covers[covers.length - 1].Key}` : null;
        }),
      );

      const formattedDuration = dayjs.duration(duration, 'seconds').format('HH:mm:ss');

      return {
        ...playlist,
        profile: { ...playlist.profile, avatar },
        musics: playlist.musics.map((music, index) => ({ ...music, album: { ...music.album, cover: covers[index] } })),
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
      throw new CustomHttpException(PLAYLIST_ERRORS.PLAYLIST_NOT_FOUND);
    }

    if (playlist.profile.id !== profileId) {
      throw new CustomHttpException(PLAYLIST_ERRORS.INVALID_USER);
    }

    return await this.playlistsRepository.updatePlaylist(profileId, updatePlaylistDto);
  }

  async deletePlaylist(profileId: number, playlistId: number) {
    const playlist = await this.findPlaylist(playlistId);

    if (!playlist) {
      throw new CustomHttpException(PLAYLIST_ERRORS.PLAYLIST_NOT_FOUND);
    }

    if (playlist.profile.id !== profileId) {
      throw new CustomHttpException(PLAYLIST_ERRORS.INVALID_USER);
    }

    return await this.playlistsRepository.deletePlaylist(playlistId);
  }
}
