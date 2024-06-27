import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './albums.dto';

@ApiTags('Albums ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @ApiOperation({ summary: '앨범 리스트 조회' })
  @Get()
  async findAlbums() {
    return await this.albumsService.findAlbums();
  }

  @ApiOperation({ summary: '앨범 등록' })
  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumsService.createAlbum(createAlbumDto);
  }
}
