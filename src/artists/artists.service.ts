import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { ArtistsRepository } from './artists.repository';
import { AwsService } from 'src/aws/aws.service';
import { CreateArtistAvatarDto, CreateArtistDto, UpdateArtistAvatarDto, UpdateArtistDto } from './artists.dto';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly artistsRepository: ArtistsRepository,
    private readonly awsService: AwsService,
  ) {}

  async findArtists() {
    const findArtists = await this.artistsRepository.findArtists();

    const artistsAsync = findArtists.map(async (artist) => {
      const avatars = artist.avatar ? await this.awsService.findImages(artist.avatar) : null;

      const avatar = avatars ? `${process.env.AWS_CLOUDFRONT_DOMAIN}/${avatars[avatars.length - 1].Key}` : null;

      return { ...artist, avatar };
    });

    const artists = await Promise.all(artistsAsync);

    return { artists };
  }

  async findArtist(artistId: number) {
    return await this.artistsRepository.findArtist(artistId);
  }

  async findArtistByName(name: string) {
    return await this.artistsRepository.findArtistByName(name);
  }

  async createArtist({ name, description }: CreateArtistDto, createArtistAvatarDto: CreateArtistAvatarDto) {
    const artist = await this.findArtistByName(name);

    if (artist) {
      throw new ConflictException('이미 등록된 아티스트 입니다.');
    }

    if (createArtistAvatarDto.length > 0) {
      const lastArtist = await this.artistsRepository.findLastArtist();

      const lastArtistId = lastArtist?.id ?? 0;

      const uploadPath = `artists/${lastArtistId + 1}/avatar`;

      await this.awsService.uploadImages(createArtistAvatarDto, uploadPath);

      return await this.artistsRepository.createArtist(name, description, uploadPath);
    }

    return await this.artistsRepository.createArtist(name, description);
  }

  async updateArtist(artistId: number, updateArtistDto: UpdateArtistDto, updateArtistAvatarDto: UpdateArtistAvatarDto) {
    const findArtist = await this.findArtist(artistId);

    if (!findArtist) {
      throw new NotFoundException('아티스트를 찾을 수 없습니다.');
    }

    if (findArtist.name !== updateArtistDto.name) {
      const findArtistByName = await this.findArtistByName(updateArtistDto.name);

      if (findArtistByName) {
        throw new ConflictException('이미 등록된 아티스트 입니다.');
      }
    }

    if (updateArtistAvatarDto.length > 0) {
      const uploadPath = `artists/${artistId}/avatar`;

      await this.awsService.deleteImages(uploadPath);

      await this.awsService.uploadImages(updateArtistAvatarDto, uploadPath);

      updateArtistDto.avatar = uploadPath;
    }

    return await this.artistsRepository.updateArtist(artistId, updateArtistDto);
  }

  async deleteArtist(artistId: number) {
    const artist = await this.findArtist(artistId);

    if (!artist) {
      throw new NotFoundException('아티스트를 찾을 수 없습니다.');
    }

    return await this.artistsRepository.deleteArtist(artistId);
  }
}
