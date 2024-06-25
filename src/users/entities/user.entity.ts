import { ApiProperty } from '@nestjs/swagger';
import { Role, User as UserModel } from '@prisma/client';
import { IsEmail, IsEnum, IsMobilePhone, IsPositive, IsString, Length, Matches } from 'class-validator';

import { Common } from 'src/common/entities';

export class User extends Common implements UserModel {
  @ApiProperty({ minimum: 1, description: 'ID' })
  @IsPositive()
  id: number;

  @ApiProperty({ required: true, description: '유저 로그인 아이디', example: 'rolldeep' })
  @Matches(/^[a-zA-Z0-9]{4,16}$/, { message: 'username must be a username' })
  username: string;

  @ApiProperty({ required: true, description: '이메일', example: 'rolldeep@stepmerrily.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: '비밀번호(특수 문자 포함)', example: '123456789a!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_=+])[A-Za-z\d`~!@#$%^&*()_=+]{8,16}$/, {
    message: 'password must be a password',
  })
  password: string;

  @ApiProperty({ required: true, description: '이름', example: '이영우' })
  @Length(2, 6)
  @IsString()
  name: string;

  @ApiProperty({ required: true, description: '휴대폰 번호', example: '01053906571' })
  @IsMobilePhone('ko-KR')
  phoneNumber: string;

  @ApiProperty({ default: 'USER', description: '권한' })
  @IsEnum(Role)
  role: Role;
}
