import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { InstrumentsService } from './instruments.service';
import { CreateInstrumentDto, UpdateInstrumentDto } from './instruments.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

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

  @ApiOperation({ summary: '악기 수정' })
  @Put(':id')
  async updateInstrument(
    @Param('id', ParsePositiveIntPipe) instrumentId: number,
    @Body() updateInstrumentDto: UpdateInstrumentDto,
  ) {
    await this.instrumentsService.updateInstrument(instrumentId, updateInstrumentDto);
  }

  @ApiOperation({ summary: '악기 삭제' })
  @Delete(':id')
  async deleteInstrument(@Param('id', ParsePositiveIntPipe) instrumentId: number) {
    await this.instrumentsService.deleteInstrument(instrumentId);
  }
}
