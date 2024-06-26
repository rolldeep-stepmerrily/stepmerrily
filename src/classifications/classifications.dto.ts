import { PickType } from '@nestjs/swagger';

import { MajorClassification, MinorClassification } from './entities';

export class CreateMajorClassificationDto extends PickType(MajorClassification, ['name'] as const) {}

export class UpdateMajorClassificationDto extends PickType(MajorClassification, ['name'] as const) {}

export class CreateMinorClassificationDto extends PickType(MinorClassification, ['name', 'majorId'] as const) {}

export class UpdateMinorClassificationDto extends PickType(MinorClassification, ['name', 'majorId'] as const) {}
