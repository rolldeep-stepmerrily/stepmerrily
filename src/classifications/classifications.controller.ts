import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ClassificationsService } from './classifications.service';
import { CreateClassificationDto, UpdateClassificationDto } from './classifications.dto';

@ApiTags('Classifications ⚠️')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('admin'))
@Controller('classifications')
export class ClassificationsController {
  constructor(private readonly classificationsService: ClassificationsService) {}

  @ApiOperation({ summary: '악기 분류 생성 ' })
  @Post()
  async createClassification(@Body() createClassificationDto: CreateClassificationDto) {
    await this.classificationsService.createClassification(createClassificationDto);
  }

  @ApiOperation({ summary: '악기 분류 리스트 조회 ' })
  @Get()
  async findClassifications() {
    return await this.classificationsService.findClassifications();
  }

  @ApiOperation({ summary: '악기 분류 수정' })
  @Put(':id')
  async updateClassification(
    @Param('id') classificationId: number,
    @Body() updateClassificationDto: UpdateClassificationDto,
  ) {
    await this.classificationsService.updateClassification(classificationId, updateClassificationDto);
  }

  @ApiOperation({ summary: '악기 분류 삭제' })
  @Delete(':id')
  async deleteClassification(@Param('id') classificationId: number) {
    await this.classificationsService.deleteClassification(classificationId);
  }
}
