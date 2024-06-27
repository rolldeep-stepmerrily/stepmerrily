import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { MusicsService } from './musics.service';

@ApiTags('Musics ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @ApiOperation({ summary: '음악 리스트 조회' })
  @Get()
  async findMusics() {
    return await this.musicsService.findMusics();
  }

  @ApiOperation({ summary: 'LAST FM API를 통하여 음악 검색' })
  @Get('search')
  async searchMusicsFromLastFM(@Query('q') query: string) {
    return await this.musicsService.searchMusicsFromLastFM(query);
  }
}
