import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto, UpdateManufacturerDto } from './manufacturers.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

@ApiTags('Manufacturers ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @ApiOperation({ summary: '제조사 등록' })
  @Post()
  async createManufacturer(createManufacturerDto: CreateManufacturerDto) {
    return await this.manufacturersService.createManufacturer(createManufacturerDto);
  }

  @ApiOperation({ summary: '제조사 리스트 조회' })
  @Get()
  async findManufacturers() {
    return await this.manufacturersService.findManufacturers();
  }

  @ApiOperation({ summary: '제조사 수정' })
  @Put(':id')
  async updateManufacturer(
    @Param('id', ParsePositiveIntPipe) manufacturerId: number,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return await this.manufacturersService.updateManufacturer(manufacturerId, updateManufacturerDto);
  }

  @ApiOperation({ summary: '제조사 삭제' })
  @Delete(':id')
  async deleteManufacturer(@Param('id', ParsePositiveIntPipe) manufacturerId: number) {
    return await this.manufacturersService.deleteManufacturer(manufacturerId);
  }
}
