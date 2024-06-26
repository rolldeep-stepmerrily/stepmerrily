import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMajorClassificationDto, UpdateMajorClassificationDto } from './classifications.dto';

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
}
