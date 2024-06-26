import { PickType } from '@nestjs/swagger';

import { MajorClassification } from './entities';

export class CreateMajorClassificationDto extends PickType(MajorClassification, ['name'] as const) {}

export class UpdateMajorClassificationDto extends PickType(MajorClassification, ['name'] as const) {}
