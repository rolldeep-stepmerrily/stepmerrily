import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ClassificationsService } from './classifications.service';
import { CreateMajorClassificationDto, UpdateMajorClassificationDto } from './classifications.dto';

@ApiTags('Classifications ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('classifications')
export class ClassificationsController {
  constructor(private readonly classificationsService: ClassificationsService) {}

  @ApiOperation({ summary: '악기 대분류 생성 ' })
  @Post('major')
  async createMajorClassification(@Body() createMajorClassificationDto: CreateMajorClassificationDto) {
    await this.classificationsService.createMajorClassification(createMajorClassificationDto);
  }

  @ApiOperation({ summary: '악기 대분류 리스트 조회 ' })
  @Get('major')
  async findMajorClassifications() {
    return await this.classificationsService.findMajorClassifications();
  }

  @ApiOperation({ summary: '악기 대분류 수정' })
  @Put('major/:id')
  async updateMajorClassification(
    @Param('id') majorClassificationId: number,
    @Body() updateMajorClassificationDto: UpdateMajorClassificationDto,
  ) {
    await this.classificationsService.updateMajorClassification(majorClassificationId, updateMajorClassificationDto);
  }

  @ApiOperation({ summary: '악기 대분류 삭제' })
  @Delete('major/:id')
  async deleteMajorClassification(@Param('id') classificationId: number) {
    await this.classificationsService.deleteMajorClassification(classificationId);
  }
}
