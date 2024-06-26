import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { IsObject, IsString, Length } from 'class-validator';

import { Term, User } from './entities';
import { Profile } from '../profiles/entities';

export class CheckUsernameForSignUpDto extends PickType(User, ['username'] as const) {}

export class CheckEmailForSignUpDto extends PickType(User, ['email'] as const) {}

export class CheckNicknameForSignUpDto extends PickType(Profile, ['nickname'] as const) {}

export class CheckPhoneNumberForSignUpDto extends PickType(User, ['phoneNumber'] as const) {}

export class CertifyEmailDto extends PickType(User, ['email'] as const) {}

export class VerifyEmailDto extends PickType(User, ['email'] as const) {
  @ApiProperty({ required: true, description: '인증번호' })
  @IsString()
  @Length(6, 6)
  authCode: string;
}

export class CreateTermsDto extends OmitType(Term, ['id', 'createdAt', 'updatedAt', 'deletedAt'] as const) {}

export class CreateUserDto extends IntersectionType(
  PickType(User, ['username', 'password', 'name', 'email', 'phoneNumber'] as const),
  PickType(Profile, ['nickname'] as const),
) {
  @ApiProperty({ required: true, description: '약관 동의' })
  @IsObject()
  terms: CreateTermsDto;
}

export class FindUsernameByEmailDto extends PickType(User, ['email'] as const) {}

export class UpdatePasswordDto extends PickType(User, ['username', 'password'] as const) {}

export class SignInDto extends PickType(User, ['username', 'password'] as const) {}
