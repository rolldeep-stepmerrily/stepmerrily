import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

import { AlbumsService } from './albums.service';
import {
  CreateAlbumDto,
  CreateAlbumWithCoverDto,
  CreateCoverDto,
  UpdateAlbumDto,
  UpdateAlbumWithCoverDto,
  UpdateCoverDto,
} from './albums.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

@ApiTags('Albums ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @ApiOperation({ summary: '앨범 등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAlbumWithCoverDto })
  @UseInterceptors(FilesInterceptor('cover', 1))
  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto, @UploadedFiles() createCoverDto: CreateCoverDto) {
    await this.albumsService.createAlbum(createAlbumDto, createCoverDto);
  }

  @ApiOperation({ summary: '앨범 리스트 조회' })
  @Get()
  async findAlbums() {
    return await this.albumsService.findAlbums();
  }

  @ApiOperation({ summary: '앨범 수정' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAlbumWithCoverDto })
  @UseInterceptors(FilesInterceptor('cover', 1))
  @Put(':id')
  async updateAlbum(
    @Param('id', ParsePositiveIntPipe) albumId: number,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @UploadedFiles() updateCoverDto: UpdateCoverDto,
  ) {
    await this.albumsService.updateAlbum(albumId, updateAlbumDto, updateCoverDto);
  }

  @ApiOperation({ summary: '앨범 삭제' })
  @Delete(':id')
  async deleteAlbum(@Param('id', ParsePositiveIntPipe) albumId: number) {
    await this.albumsService.deleteAlbum(albumId);
  }
}
