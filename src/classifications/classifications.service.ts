import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import {
  CreateMajorClassificationDto,
  CreateMinorClassificationDto,
  UpdateMajorClassificationDto,
  UpdateMinorClassificationDto,
} from './classifications.dto';
import { CLASSIFICATIONS_ERRORS } from './classifications.exception';
import { ClassificationsRepository } from './classifications.repository';

@Injectable()
export class ClassificationsService {
  constructor(private readonly classificationsRepository: ClassificationsRepository) {}

  async createMajorClassification(createMajorClassificationDto: CreateMajorClassificationDto) {
    return await this.classificationsRepository.createMajorClassification(createMajorClassificationDto);
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
      throw new CustomHttpException(CLASSIFICATIONS_ERRORS.CLASSIFICATION_NOT_FOUND);
    }

    return await this.classificationsRepository.updateMajorClassification(
      majorClassificationId,
      updateMajorClassificationDto,
    );
  }

  async deleteMajorClassification(majorClassificationId: number) {
    const classification = await this.findMajorClassification(majorClassificationId);

    if (!classification) {
      throw new CustomHttpException(CLASSIFICATIONS_ERRORS.CLASSIFICATION_NOT_FOUND);
    }

    return await this.classificationsRepository.deleteMajorClassification(majorClassificationId);
  }

  async createMinorClassification(createMinorClassificationDto: CreateMinorClassificationDto) {
    return await this.classificationsRepository.createMinorClassification(createMinorClassificationDto);
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
      throw new CustomHttpException(CLASSIFICATIONS_ERRORS.CLASSIFICATION_NOT_FOUND);
    }

    return await this.classificationsRepository.updateMinorClassification(
      minorClassification.id,
      updateMinorClassificationDto,
    );
  }

  async deleteMinorClassification(minorClassificationId: number) {
    const minorClassification = await this.findMinorClassification(minorClassificationId);

    if (!minorClassification) {
      throw new CustomHttpException(CLASSIFICATIONS_ERRORS.CLASSIFICATION_NOT_FOUND);
    }

    return await this.classificationsRepository.deleteMinorClassification(minorClassification.id);
  }
}
