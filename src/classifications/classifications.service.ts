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

  async findMajorClassification(majorClassificationId: number) {
    return await this.classificationsRepository.findMajorClassification(majorClassificationId);
  }

  async updateMajorClassification(
    majorClassificationId: number,
    updateMajorClassificationDto: UpdateMajorClassificationDto,
  ) {
    const majorClassification = await this.findMajorClassification(majorClassificationId);

    if (!majorClassification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.updateMajorClassification(majorClassificationId, updateMajorClassificationDto);
  }

  async deleteMajorClassification(majorClassificationId: number) {
    const classification = await this.findMajorClassification(majorClassificationId);

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

  async findMinorClassification(minorClassificationId: number) {
    return await this.classificationsRepository.findMinorClassification(minorClassificationId);
  }

  async updateMinorClassification(
    minorClassificationId: number,
    updateMinorClassificationDto: UpdateMinorClassificationDto,
  ) {
    const minorClassification = await this.findMinorClassification(minorClassificationId);

    if (!minorClassification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.updateMinorClassification(
      minorClassification.id,
      updateMinorClassificationDto,
    );
  }

  async deleteMinorClassification(minorClassificationId: number) {
    const minorClassification = await this.findMinorClassification(minorClassificationId);

    if (!minorClassification) {
      throw new NotFoundException('악기 분류를 찾을 수 없습니다.');
    }

    await this.classificationsRepository.deleteMinorClassification(minorClassification.id);
  }
}
