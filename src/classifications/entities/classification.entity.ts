import { ApiProperty } from '@nestjs/swagger';
import { Classification as ClassificationModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class Classification extends Common implements ClassificationModel {
  @ApiProperty({ description: '분류 ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '분류 이름', required: true })
  @IsString()
  name: string;
}
