import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';

import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateMajorClassificationDto,
  CreateMinorClassificationDto,
  UpdateMajorClassificationDto,
  UpdateMinorClassificationDto,
} from './classifications.dto';

@Injectable()
export class ClassificationsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createMajorClassification({ name }: CreateMajorClassificationDto) {
    try {
      return await this.prismaService.majorClassification.create({ data: { name } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findMajorClassifications() {
    try {
      return await this.prismaService.majorClassification.findMany({
        where: { deletedAt: null },
        orderBy: { id: 'asc' },
        select: { id: true, name: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findMajorClassification(majorClassificationId: number) {
    try {
      return await this.prismaService.majorClassification.findUnique({
        where: { id: majorClassificationId, deletedAt: null },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateMajorClassification(majorClassificationId: number, { name }: UpdateMajorClassificationDto) {
    try {
      return await this.prismaService.majorClassification.update({
        where: { id: majorClassificationId },
        data: { name },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteMajorClassification(majorClassificationId: number) {
    try {
      return await this.prismaService.majorClassification.update({
        where: { id: majorClassificationId },
        data: { deletedAt: dayjs().toISOString() },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async createMinorClassification({ name, majorId }: CreateMinorClassificationDto) {
    try {
      return await this.prismaService.minorClassification.create({ data: { name, majorId } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findMinorClassifications() {
    try {
      return await this.prismaService.minorClassification.findMany({
        where: { deletedAt: null, majorClassification: { deletedAt: null } },
        orderBy: { id: 'asc' },
        select: { id: true, name: true, majorClassification: { select: { id: true, name: true } } },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findMinorClassification(minorClassificationId: number) {
    try {
      return await this.prismaService.minorClassification.findUnique({
        where: { id: minorClassificationId, deletedAt: null },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateMinorClassification(minorClassificationId: number, { name, majorId }: UpdateMinorClassificationDto) {
    try {
      return await this.prismaService.minorClassification.update({
        where: { id: minorClassificationId },
        data: { name, majorId },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteMinorClassification(minorClassificationId: number) {
    try {
      return await this.prismaService.minorClassification.update({
        where: { id: minorClassificationId },
        data: { deletedAt: dayjs().toISOString() },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
