import { ApiProperty } from '@nestjs/swagger';

import { Manufacturer as ManufacturerModel } from '@prisma/client';
import { IsPositive, IsString } from 'class-validator';

import { BaseEntity } from '@@entities';

export class Manufacturer extends BaseEntity implements ManufacturerModel {
  @ApiProperty({ description: '제조사 ID' })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '제조사 이름' })
  @IsString()
  name: string;
}
