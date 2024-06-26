import { ApiProperty } from '@nestjs/swagger';
import { MinorClassification as MinorClassificationModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class MinorClassification extends Common implements MinorClassificationModel {
  @ApiProperty({ description: '소분류 ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '소분류 이름', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '대분류 ID', minimum: 1 })
  @IsPositive()
  majorId: number;
}
