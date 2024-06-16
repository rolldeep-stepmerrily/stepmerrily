import { ApiProperty } from '@nestjs/swagger';
import { Role, User as UserModel } from '@prisma/client';
import { IsDate, IsEmail, IsEnum, IsMobilePhone, IsPositive, IsString, Length, Matches } from 'class-validator';

export class User implements UserModel {
  @ApiProperty({ required: true, minimum: 1, description: 'id' })
  @IsPositive()
  id: number;

  @ApiProperty({ required: true, description: '아이디' })
  @Matches(/^[a-zA-Z0-9]{4,16}$/, { message: 'username must be a username' })
  username: string;

  @ApiProperty({ required: true, description: '비밀번호(특수 문자 포함)' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_=+])[A-Za-z\d`~!@#$%^&*()_=+]{8,16}$/, {
    message: 'password must be a password',
  })
  password: string;

  @ApiProperty({ required: true, description: '이름' })
  @Length(2, 6)
  @IsString()
  name: string;

  @ApiProperty({ required: true, description: '닉네임' })
  @Matches(/^[가-힣a-zA-Z0-9]{2,10}$/, { message: 'nickname must be a nickname' })
  nickname: string;

  @ApiProperty({ required: true, description: '이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: '휴대폰 번호' })
  @IsMobilePhone('ko-KR')
  phoneNumber: string;

  @ApiProperty({ description: '아바타' })
  @IsString()
  avatar: string | null;

  @ApiProperty({ default: 'USER', description: '권한' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: '회원가입 날짜' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: '업데이트 날짜' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: '회원 탈퇴 날짜' })
  @IsDate()
  deletedAt: Date | null;
}
