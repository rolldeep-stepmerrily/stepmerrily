import { Injectable } from '@nestjs/common';

import { ClassificationsRepository } from './classifications.repository';

@Injectable()
export class ClassificationsService {
  constructor(private readonly classificationsRepository: ClassificationsRepository) {}
}
