import { Injectable, NotFoundException } from '@nestjs/common';

import { ClassificationsRepository } from './classifications.repository';
import {
  CreateMajorClassificationDto,
  CreateMinorClassificationDto,
  UpdateMajorClassificationDto,
  UpdateMinorClassificationDto,
} from './classifications.dto';

@Injectable()
export class ClassificationsService {
  constructor(private readonly classificationsRepository: ClassificationsRepository) {}

  async createMajorClassification(createMajorClassificationDto: CreateMajorClassificationDto) {
    await this.classificationsRepository.createMajorClassification(createMajorClassificationDto);
  }

  async findMajorClassifications() {
    const majorClassifications = await this.classificationsRepository.findMajorClassifications();

    return { majorClassifications };
  }

  async updateMajorClassification(
    majorClassificationId: number,
    updateMajorClassificationDto: UpdateMajorClassificationDto,
  ) {
    const majorClassification = await this.classificationsRepository.findMajorClassification(majorClassificationId);

    if (!majorClassification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.updateMajorClassification(majorClassificationId, updateMajorClassificationDto);
  }

  async deleteMajorClassification(majorClassificationId: number) {
    const classification = await this.classificationsRepository.findMajorClassification(majorClassificationId);

    if (!classification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.deleteMajorClassification(majorClassificationId);
  }

  async createMinorClassification(createMinorClassificationDto: CreateMinorClassificationDto) {
    await this.classificationsRepository.createMinorClassification(createMinorClassificationDto);
  }

  async findMinorClassifications() {
    const minorClassifications = await this.classificationsRepository.findMinorClassifications();

    return { minorClassifications };
  }

  async updateMinorClassification(
    minorClassificationId: number,
    updateMinorClassificationDto: UpdateMinorClassificationDto,
  ) {
    const majorClassification = await this.classificationsRepository.findMinorClassification(minorClassificationId);

    if (!majorClassification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.updateMinorClassification(minorClassificationId, updateMinorClassificationDto);
  }

  async deleteMinorClassification(minorClassificationId: number) {
    const classification = await this.classificationsRepository.findMinorClassification(minorClassificationId);

    if (!classification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.deleteMinorClassification(minorClassificationId);
  }
}