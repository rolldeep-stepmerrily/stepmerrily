import { Injectable, NotFoundException } from '@nestjs/common';

import { ClassificationsRepository } from './classifications.repository';
import { CreateClassificationDto, UpdateClassificationDto } from './classifications.dto';

@Injectable()
export class ClassificationsService {
  constructor(private readonly classificationsRepository: ClassificationsRepository) {}

  async createClassification(createClassificationDto: CreateClassificationDto) {
    await this.classificationsRepository.createClassification(createClassificationDto);
  }

  async findClassifications() {
    const classifications = await this.classificationsRepository.findClassifications();

    return { classifications };
  }

  async updateClassification(classificationId: number, updateClassificationDto: UpdateClassificationDto) {
    const classification = await this.classificationsRepository.findClassification(classificationId);

    if (!classification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.updateClassification(classificationId, updateClassificationDto);
  }

  async deleteClassification(classificationId: number) {
    const classification = await this.classificationsRepository.findClassification(classificationId);

    if (!classification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.deleteClassification(classificationId);
  }
}
