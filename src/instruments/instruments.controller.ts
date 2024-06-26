import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { InstrumentsService } from './instruments.service';
import { CreateInstrumentDto } from './instruments.dto';

@ApiTags('Instruments ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @ApiOperation({ summary: '악기 등록' })
  @Post()
  async createInstrument(createInstrumentDto: CreateInstrumentDto) {
    return await this.instrumentsService.createInstrument(createInstrumentDto);
  }

  @ApiOperation({ summary: '악기 리스트 조회' })
  @Get()
  async findInstruments() {
    return await this.instrumentsService.findInstruments();
  }
}
