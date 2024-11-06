import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ParsePositiveIntPipe } from 'src/common/pipes';

import { CreateMusicDto, SearchMusicsDto, UpdateMusicDto } from './musics.dto';
import { MusicsService } from './musics.service';

@ApiTags('Musics ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @ApiOperation({ summary: '음악 등록' })
  @Post()
  async createMusic(@Body() createMusicDto: CreateMusicDto) {
    return await this.musicsService.createMusic(createMusicDto);
  }

  @ApiOperation({ summary: '음악 리스트 조회' })
  @Get()
  async findMusics() {
    return await this.musicsService.findMusics();
  }

  @ApiOperation({ summary: 'LAST FM API를 통하여 음악 검색' })
  @Get('search')
  async searchMusicsFromLastFM(@Query() searchMusicsDto: SearchMusicsDto) {
    return await this.musicsService.searchMusicsFromLastFM(searchMusicsDto);
  }

  @ApiOperation({ summary: '음악 수정' })
  @Put(':id')
  async updateMusic(@Param('id', ParsePositiveIntPipe) musicId: number, @Body() updateMusicDto: UpdateMusicDto) {
    return await this.musicsService.updateMusic(musicId, updateMusicDto);
  }

  @ApiOperation({ summary: '음악 삭제' })
  @Delete(':id')
  async deleteMusic(@Param('id', ParsePositiveIntPipe) musicId: number) {
    return await this.musicsService.deleteMusic(musicId);
  }
}
