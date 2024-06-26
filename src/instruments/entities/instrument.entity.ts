import { ApiProperty } from '@nestjs/swagger';
import { Instrument as InstrumentModel } from '@prisma/client';
import { IsOptional, IsPositive, IsString } from 'class-validator';

import { Common } from 'src/common/entities';

export class Instrument extends Common implements InstrumentModel {
  @ApiProperty({ description: '악기 ID', example: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '악기 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '악기 소분류 ID' })
  @IsPositive()
  minorClassificationId: number;

  @ApiProperty({ description: '제조사 ID' })
  @IsPositive()
  manufacturerId: number;

  @ApiProperty({ description: '시리얼 번호', nullable: true })
  @IsOptional()
  @IsString()
  serialNumber: string | null;
}
