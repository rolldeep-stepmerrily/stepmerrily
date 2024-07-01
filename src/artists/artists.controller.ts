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

import { ArtistsService } from './artists.service';
import {
  CreateArtistAvatarDto,
  CreateArtistDto,
  CreateArtistWithAvatarDto,
  UpdateArtistAvatarDto,
  UpdateArtistDto,
  UpdateArtistWithAvatarDto,
} from './artists.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Artists')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @ApiOperation({ summary: '아티스트 등록' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateArtistWithAvatarDto })
  @UseInterceptors(FilesInterceptor('avatar', 1))
  @Post()
  async createArtist(
    @Body() createArtistDto: CreateArtistDto,
    @UploadedFiles() createArtistAvatarDto: CreateArtistAvatarDto,
  ) {
    await this.artistsService.createArtist(createArtistDto, createArtistAvatarDto);
  }

  @ApiOperation({ summary: '아티스트 리스트 조회' })
  @Get()
  async findArtists() {
    return this.artistsService.findArtists();
  }

  @ApiOperation({ summary: '아티스트 수정' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateArtistWithAvatarDto })
  @UseInterceptors(FilesInterceptor('avatar', 1))
  @Put(':id')
  async updateArtist(
    @Param('id', ParsePositiveIntPipe) artistId: number,
    @Body() updateArtistDto: UpdateArtistDto,
    @UploadedFiles() updateArtistAvatarDto: UpdateArtistAvatarDto,
  ) {
    await this.artistsService.updateArtist(artistId, updateArtistDto, updateArtistAvatarDto);
  }

  @ApiOperation({ summary: '아티스트 삭제' })
  @Delete(':id')
  async deleteArtist(@Param('id', ParsePositiveIntPipe) artistId: number) {
    await this.artistsService.deleteArtist(artistId);
  }
}
