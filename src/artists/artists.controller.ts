import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './artists.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

@ApiTags('Artists')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @ApiOperation({ summary: '아티스트 등록' })
  @Post()
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    await this.artistsService.createArtist(createArtistDto);
  }

  @ApiOperation({ summary: '아티스트 리스트 조회' })
  @Get()
  async findArtists() {
    return this.artistsService.findArtists();
  }

  @ApiOperation({ summary: '아티스트 수정' })
  @Put(':id')
  async updateArtist(@Param('id', ParsePositiveIntPipe) artistId: number, @Body() updateArtistDto: UpdateArtistDto) {
    await this.artistsService.updateArtist(artistId, updateArtistDto);
  }

  @ApiOperation({ summary: '아티스트 삭제' })
  @Delete(':id')
  async deleteArtist(@Param('id', ParsePositiveIntPipe) artistId: number) {
    await this.artistsService.deleteArtist(artistId);
  }
}
