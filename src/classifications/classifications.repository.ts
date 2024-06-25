import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dayjs from 'dayjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassificationDto, UpdateClassificationDto } from './classifications.dto';

@Injectable()
export class ClassificationsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createClassification({ name }: CreateClassificationDto) {
    try {
      return await this.prismaService.classification.create({ data: { name } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findClassifications() {
    try {
      return await this.prismaService.classification.findMany({ where: { deletedAt: null } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findClassification(classificationId: number) {
    try {
      return await this.prismaService.classification.findUnique({ where: { id: classificationId, deletedAt: null } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async updateClassification(classificationId: number, { name }: UpdateClassificationDto) {
    try {
      return await this.prismaService.classification.update({ where: { id: classificationId }, data: { name } });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async deleteClassification(classificationId: number) {
    try {
      return await this.prismaService.classification.update({
        where: { id: classificationId },
        data: { deletedAt: dayjs().toISOString() },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
