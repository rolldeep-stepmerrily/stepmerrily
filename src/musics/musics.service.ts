import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { MusicsRepository } from './musics.repository';

@Injectable()
export class MusicsService {
  constructor(private readonly musicsRepository: MusicsRepository) {}

  async searchMusics(query: string) {
    const searchMusics = await this.musicsRepository.searchMusic(query);

    if (!searchMusics.length) {
      throw new NotFoundException('검색 결과가 없습니다.');
    }

    const musics = searchMusics.map((music) => {
      const duration = dayjs.duration(music.album.duration, 'seconds').format('HH:mm:ss');

      return { ...music, album: { ...music.album, duration } };
    });

    return { musics };
  }

  async findMusic(musicId: number) {
    return await this.musicsRepository.findMusic(musicId);
  }
}
