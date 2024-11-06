import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import {
  CreateMajorClassificationDto,
  CreateMinorClassificationDto,
  UpdateMajorClassificationDto,
  UpdateMinorClassificationDto,
} from './classifications.dto';

@Injectable()
@CatchDatabaseErrors()
export class ClassificationsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMajorClassification({ name }: CreateMajorClassificationDto) {
    return await this.prismaService.majorClassification.create({ data: { name }, select: { id: true } });
  }

  async findMajorClassifications() {
    return await this.prismaService.majorClassification.findMany({
      where: { deletedAt: null },
      orderBy: { id: 'asc' },
      select: { id: true, name: true },
    });
  }

  async findMajorClassification(majorClassificationId: number) {
    return await this.prismaService.majorClassification.findUnique({
      where: { id: majorClassificationId, deletedAt: null },
    });
  }

  async updateMajorClassification(majorClassificationId: number, { name }: UpdateMajorClassificationDto) {
    return await this.prismaService.majorClassification.update({
      where: { id: majorClassificationId },
      data: { name },
      select: { id: true },
    });
  }

  async deleteMajorClassification(majorClassificationId: number) {
    return await this.prismaService.majorClassification.update({
      where: { id: majorClassificationId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }

  async createMinorClassification({ name, majorId }: CreateMinorClassificationDto) {
    return await this.prismaService.minorClassification.create({ data: { name, majorId }, select: { id: true } });
  }

  async findMinorClassifications() {
    return await this.prismaService.minorClassification.findMany({
      where: { deletedAt: null, majorClassification: { deletedAt: null } },
      orderBy: { id: 'asc' },
      select: { id: true, name: true, majorClassification: { select: { id: true, name: true } } },
    });
  }

  async findMinorClassification(minorClassificationId: number) {
    return await this.prismaService.minorClassification.findUnique({
      where: { id: minorClassificationId, deletedAt: null },
      select: { id: true },
    });
  }

  async updateMinorClassification(minorClassificationId: number, { name, majorId }: UpdateMinorClassificationDto) {
    return await this.prismaService.minorClassification.update({
      where: { id: minorClassificationId },
      data: { name, majorId },
      select: { id: true },
    });
  }

  async deleteMinorClassification(minorClassificationId: number) {
    return await this.prismaService.minorClassification.update({
      where: { id: minorClassificationId },
      data: { deletedAt: dayjs().toISOString() },
      select: { id: true },
    });
  }
}
