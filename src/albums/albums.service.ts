import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { AlbumsRepository } from './albums.repository';
import { CreateAlbumDto } from './albums.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumsRepository: AlbumsRepository) {}

  async findAlbums() {
    const findAlbums = await this.albumsRepository.findAlbums();

    const albums = findAlbums.map((album) => {
      const duration = dayjs.duration(album.duration, 'seconds').format('HH:mm:ss');

      return { ...album, duration };
    });

    return { albums };
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    //TODO : 앨범 생성부터
  }
}
