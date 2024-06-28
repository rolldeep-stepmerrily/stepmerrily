import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { ArtistsRepository } from './artists.repository';
import { CreateArtistDto, UpdateArtistDto } from './artists.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  async findArtists() {
    const artists = await this.artistsRepository.findArtists();

    return { artists };
  }

  async findArtist(artistId: number) {
    return await this.artistsRepository.findArtist(artistId);
  }

  async findArtistByName(name: string) {
    return await this.artistsRepository.findArtistByName(name);
  }

  async createArtist({ name }: CreateArtistDto) {
    const artist = await this.findArtistByName(name);

    if (artist) {
      throw new ConflictException('이미 등록된 아티스트 입니다.');
    }

    return await this.artistsRepository.createArtist(name);
  }

  async updateArtist(artistId: number, { name }: UpdateArtistDto) {
    const findArtist = await this.findArtist(artistId);

    if (!findArtist) {
      throw new NotFoundException('아티스트를 찾을 수 없습니다.');
    }

    if (findArtist.name === name) {
      throw new BadRequestException('기존 이름과 변경하려는 이름이 동일합니다.');
    }

    const findArtistByName = await this.findArtistByName(name);

    if (findArtistByName) {
      throw new ConflictException('이미 등록된 아티스트 입니다.');
    }

    return await this.artistsRepository.updateArtist(artistId, name);
  }

  async deleteArtist(artistId: number) {
    const artist = await this.findArtist(artistId);

    if (!artist) {
      throw new NotFoundException('아티스트를 찾을 수 없습니다.');
    }

    return await this.artistsRepository.deleteArtist(artistId);
  }
}
