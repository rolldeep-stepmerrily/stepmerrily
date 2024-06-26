import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ClassificationsService } from './classifications.service';
import {
  CreateMajorClassificationDto,
  CreateMinorClassificationDto,
  UpdateMajorClassificationDto,
  UpdateMinorClassificationDto,
} from './classifications.dto';
import { ParsePositiveIntPipe } from 'src/common/pipes';

@ApiTags('Classifications ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('classifications')
export class ClassificationsController {
  constructor(private readonly classificationsService: ClassificationsService) {}

  @ApiOperation({ summary: '악기 대분류 생성 ' })
  @Post('majors')
  async createMajorClassification(@Body() createMajorClassificationDto: CreateMajorClassificationDto) {
    await this.classificationsService.createMajorClassification(createMajorClassificationDto);
  }

  @ApiOperation({ summary: '악기 대분류 리스트 조회 ' })
  @Get('majors')
  async findMajorClassifications() {
    return await this.classificationsService.findMajorClassifications();
  }

  @ApiOperation({ summary: '악기 대분류 수정' })
  @Put('majors/:id')
  async updateMajorClassification(
    @Param('id', ParsePositiveIntPipe) majorClassificationId: number,
    @Body() updateMajorClassificationDto: UpdateMajorClassificationDto,
  ) {
    await this.classificationsService.updateMajorClassification(majorClassificationId, updateMajorClassificationDto);
  }

  @ApiOperation({ summary: '악기 대분류 삭제' })
  @Delete('majors/:id')
  async deleteMajorClassification(@Param('id', ParsePositiveIntPipe) classificationId: number) {
    await this.classificationsService.deleteMajorClassification(classificationId);
  }

  @ApiOperation({ summary: '악기 소분류 생성' })
  @Post('minors')
  async createMinorClassification(@Body() createMinorClassificationDto: CreateMinorClassificationDto) {
    await this.classificationsService.createMinorClassification(createMinorClassificationDto);
  }

  @ApiOperation({ summary: '악기 소분류 리스트 조회' })
  @Get('minors')
  async findMinorClassifications() {
    return await this.classificationsService.findMinorClassifications();
  }

  @ApiOperation({ summary: '악기 소분류 수정' })
  @Put('minors/:id')
  async updateMinorClassification(
    @Param('id', ParsePositiveIntPipe) minorClassificationId: number,
    @Body() updateMinorClassificationDto: UpdateMinorClassificationDto,
  ) {
    await this.classificationsService.updateMinorClassification(minorClassificationId, updateMinorClassificationDto);
  }

  @ApiOperation({ summary: '악기 소분류 삭제' })
  @Delete('minors/:id')
  async deleteMinorClassification(@Param('id', ParsePositiveIntPipe) classificationId: number) {
    await this.classificationsService.deleteMinorClassification(classificationId);
  }
}
