import { ApiProperty } from '@nestjs/swagger';
import { Manufacturer as ManufacturerModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class Manufacturer extends Common implements ManufacturerModel {
  @ApiProperty({ description: '제조사 ID' })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '제조사 이름' })
  @IsString()
  name: string;
}
