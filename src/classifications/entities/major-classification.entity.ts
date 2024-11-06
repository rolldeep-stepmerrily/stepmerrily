import { ApiProperty } from '@nestjs/swagger';

import { MajorClassification as MajorClassificationModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { BaseEntity } from '@@entities';

export class MajorClassification extends BaseEntity implements MajorClassificationModel {
  @ApiProperty({ description: '대분류 ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '대분류 이름', required: true })
  @IsString()
  name: string;
}
