import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import axios from 'axios';

dayjs.extend(duration);

import { MusicsRepository } from './musics.repository';
import { IMusic } from './musics.interface';

const { LAST_FM_API_URL, LAST_FM_API_KEY } = process.env;

@Injectable()
export class MusicsService {
  constructor(private readonly musicsRepository: MusicsRepository) {}

  async findMusics() {
    const musics = await this.musicsRepository.findMusics();

    return { musics };
  }

  async searchMusicsFromDatabase(query: string) {
    const findMusics = await this.musicsRepository.searchMusics(query);
    if (!findMusics.length) {
      throw new NotFoundException('검색 결과가 없습니다.');
    }
    const musics = findMusics.map((music) => {
      const duration = dayjs.duration(music.album.duration, 'seconds').format('HH:mm:ss');
      return { ...music, album: { ...music.album, duration } };
    });
    return { musics };
  }

  async searchMusicsFromLastFM(query: string) {
    try {
      const url = `${LAST_FM_API_URL}/?method=track.search&track=${query}&api_key=${LAST_FM_API_KEY}&format=json&limit=10`;

      const result = await axios.get(url);

      const tracks = result.data.results.trackmatches.track;

      const musics = tracks.map((track: IMusic, index: number) => {
        return {
          id: index + 1,
          title: track.name,
          artist: track.artist,
          listeners: track.listeners,
        };
      });

      return { musics };
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findMusic(musicId: number) {
    return await this.musicsRepository.findMusic(musicId);
  }
}
