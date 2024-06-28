import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { AlbumsRepository } from './albums.repository';
import { AwsService } from 'src/aws/aws.service';
import { CreateAlbumDto, CreateCoverDto, UpdateAlbumDto, UpdateCoverDto } from './albums.dto';

const { AWS_CLOUDFRONT_DOMAIN } = process.env;

@Injectable()
export class AlbumsService {
  constructor(
    private readonly albumsRepository: AlbumsRepository,
    private readonly awsService: AwsService,
  ) {}

  async findAlbums() {
    const findAlbums = await this.albumsRepository.findAlbums();
    ``;
    const albumsAsync = findAlbums.map(async (album) => {
      const duration = album.duration > 0 ? dayjs.duration(album.duration, 'seconds').format('HH:mm:ss') : null;

      const covers = album.cover ? await this.awsService.findImages(album.cover) : null;

      const cover = covers ? `${AWS_CLOUDFRONT_DOMAIN}/${covers[covers.length - 1].Key}` : null;

      return { ...album, cover, duration };
    });

    const albums = await Promise.all(albumsAsync);

    return { albums };
  }

  async findAlbum(albumId: number) {
    return this.albumsRepository.findAlbum(albumId);
  }

  async createAlbum(createAlbumDto: CreateAlbumDto, createCoverDto: CreateCoverDto) {
    const [hours, minutes, seconds] = createAlbumDto.time.split(':').map(Number);

    const duration = dayjs.duration({ hours, minutes, seconds }).asSeconds();

    const releasedAt = dayjs(createAlbumDto.releasedAt).toDate();

    if (createCoverDto.length > 0) {
      const lastAlbum = await this.albumsRepository.findLastAlbum();

      const lastAlbumId = lastAlbum?.id ?? 0;

      const uploadPath = `albums/${lastAlbumId + 1}/cover`;

      await this.awsService.uploadImages(createCoverDto, uploadPath);

      return await this.albumsRepository.createAlbum({ ...createAlbumDto, cover: uploadPath, duration, releasedAt });
    }

    return await this.albumsRepository.createAlbum({ ...createAlbumDto, duration, releasedAt });
  }

  async updateAlbum(albumId: number, updateAlbumDto: UpdateAlbumDto, updateCoverDto: UpdateCoverDto) {
    const album = await this.findAlbum(albumId);

    if (!album) {
      throw new NotFoundException('앨범을 찾을 수 없습니다.');
    }

    const [hours, minutes, seconds] = updateAlbumDto.time.split(':').map(Number);

    const duration = dayjs.duration({ hours, minutes, seconds }).asSeconds();

    const releasedAt = dayjs(updateAlbumDto.releasedAt).toDate();

    if (updateCoverDto.length > 0) {
      if (album.cover) {
        await this.awsService.deleteImages(album.cover);
      }

      const uploadPath = `albums/${albumId}/cover`;

      await this.awsService.uploadImages(updateCoverDto, uploadPath);

      return await this.albumsRepository.updateAlbum(albumId, {
        ...updateAlbumDto,
        cover: uploadPath,
        duration,
        releasedAt,
      });
    }

    return await this.albumsRepository.updateAlbum(albumId, { ...updateAlbumDto, duration, releasedAt });
  }

  async deleteAlbum(albumId: number) {
    const album = await this.findAlbum(albumId);

    if (!album) {
      throw new NotFoundException('앨범을 찾을 수 없습니다.');
    }

    return await this.albumsRepository.deleteAlbum(albumId);
  }
}
