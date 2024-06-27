import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import axios from 'axios';

dayjs.extend(duration);

import { MusicsRepository } from './musics.repository';
import { IMusic } from './musics.interface';
import { CreateMusicDto, SearchMusicsDto, UpdateMusicDto } from './musics.dto';

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

  async searchMusicsFromLastFM({ query, page }: SearchMusicsDto) {
    try {
      const url = `${LAST_FM_API_URL}/?method=track.search&track=${query}&api_key=${LAST_FM_API_KEY}&format=json&limit=20&page=${page}`;

      const result = await axios.get(url);

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
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
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
      throw new NotFoundException('음악을 찾을 수 없습니다.');
    }

    const [hours, minutes, seconds] = time.split(':').map(Number);

    const duration = dayjs.duration({ hours, minutes, seconds }).asSeconds();

    return await this.musicsRepository.updateMusic(musicId, albumId, title, duration, isLeadSingle);
  }

  async deleteMusic(musicId: number) {
    const music = await this.findMusic(musicId);

    if (!music) {
      throw new NotFoundException('음악을 찾을 수 없습니다.');
    }

    return await this.musicsRepository.deleteMusic(musicId);
  }
}
