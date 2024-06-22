import { Term as TermModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsPositive } from 'class-validator';

export class Term implements TermModel {
  @ApiProperty({ description: 'ID', minimum: 1 })
  @IsPositive()
  id: number;

  @ApiProperty({ description: '(필수)서비스 이용 약관 동의 여부', default: false })
  @IsBoolean()
  isService: boolean;

  @ApiProperty({ description: '(필수)개인정보 처리 방침 동의 여부', default: false })
  @IsBoolean()
  isPrivacy: boolean;

  @ApiProperty({ description: '(선택)개인정보 처리 방침 동의 여부', default: false })
  @IsBoolean()
  isPrivacyOption: boolean;

  @ApiProperty({ description: '(필수)만 14세 이상 여부', default: false })
  @IsBoolean()
  isAge: boolean;

  @ApiProperty({ description: 'created at' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'created at' })
  @IsDate()
  updatedAt: Date | null;

  @ApiProperty({ description: 'created at' })
  @IsDate()
  deletedAt: Date | null;
}
