import { Inject, Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { CustomHttpException } from '@@exceptions';

import { CreateMusicDto, SearchMusicsDto, UpdateMusicDto } from './musics.dto';
import { MUSIC_ERRORS } from './musics.exception';
import { IMusic } from './musics.interface';
import { MusicsRepository } from './musics.repository';

@Injectable()
export class MusicsService {
  constructor(
    private readonly musicsRepository: MusicsRepository,
    @Inject('LAST_FM_API_URL') private readonly lastFmApiUrl: string,
    @Inject('LAST_FM_API_KEY') private readonly lastFmApiKey: string,
  ) {}

  async findMusics() {
    const musics = await this.musicsRepository.findMusics();

    return { musics };
  }

  async searchMusicsFromDatabase(query: string) {
    const findMusics = await this.musicsRepository.searchMusics(query);

    if (!findMusics.length) {
      throw new CustomHttpException(MUSIC_ERRORS.MUSIC_NOT_FOUND);
    }

    const musics = findMusics.map((music) => {
      const duration = dayjs.duration(music.album.duration, 'seconds').format('HH:mm:ss');

      return { ...music, album: { ...music.album, duration } };
    });

    return { musics };
  }

  async searchMusicsFromLastFM({ query, page }: SearchMusicsDto) {
    const url = `${this.lastFmApiUrl}/?method=track.search&track=${query}&api_key=${this.lastFmApiKey}&format=json&limit=20&page=${page}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new CustomHttpException(MUSIC_ERRORS.FAILED_TO_FETCH);
    }

    const result = await response.json();

    const tracks = result.data.results.trackmatches.track;

    const musics = tracks.map((track: IMusic, index: number) => {
      return {
        id: index + 1,
        title: track.name,
        artist: track.artist,
        listeners: parseInt(track.listeners) ?? 0,
        images: track.image,
      };
    });

    return { musics };
  }

  async findMusic(musicId: number) {
    return await this.musicsRepository.findMusic(musicId);
  }

  async createMusic({ albumId, title, time, isLeadSingle }: CreateMusicDto) {
    const [hours, minutes, seconds] = time.split(':').map(Number);

    const duration = dayjs.duration({ hours, minutes, seconds }).asSeconds();

    return await this.musicsRepository.createMusic(albumId, title, duration, isLeadSingle);
  }

  async updateMusic(musicId: number, { albumId, title, time, isLeadSingle }: UpdateMusicDto) {
    const music = await this.findMusic(musicId);

    if (!music) {
      throw new CustomHttpException(MUSIC_ERRORS.MUSIC_NOT_FOUND);
    }

    const [hours, minutes, seconds] = time.split(':').map(Number);

    const duration = dayjs.duration({ hours, minutes, seconds }).asSeconds();

    return await this.musicsRepository.updateMusic(musicId, albumId, title, duration, isLeadSingle);
  }

  async deleteMusic(musicId: number) {
    const music = await this.findMusic(musicId);

    if (!music) {
      throw new CustomHttpException(MUSIC_ERRORS.MUSIC_NOT_FOUND);
    }

    return await this.musicsRepository.deleteMusic(musicId);
  }
}
