import { ApiProperty } from '@nestjs/swagger';
import { MajorClassification as MajorClassificationModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class MajorClassification extends Common implements MajorClassificationModel {
  @ApiProperty({ description: '대분류 ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '대분류 이름', required: true })
  @IsString()
  name: string;
}
