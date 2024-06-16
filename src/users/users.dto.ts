import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

import { User } from './entities/user.entity';

export class CheckUsernameForSignUpDto extends PickType(User, ['username'] as const) {}

export class CheckEmailForSignUpDto extends PickType(User, ['email'] as const) {}

export class CheckNicknameForSignUpDto extends PickType(User, ['nickname'] as const) {}

export class CheckPhoneNumberForSignUpDto extends PickType(User, ['phoneNumber'] as const) {}

export class CertifyEmailDto extends PickType(User, ['email'] as const) {}

export class VerifyEmailDto extends PickType(User, ['email'] as const) {
  @ApiProperty({ required: true, description: '인증번호' })
  @IsString()
  @Length(6, 6)
  authCode: string;
}

export class CreateUserDto extends PickType(User, [
  'username',
  'password',
  'name',
  'nickname',
  'email',
  'phoneNumber',
] as const) {}

export class FindUsernameByEmailDto extends PickType(User, ['email'] as const) {}

export class UpdatePasswordDto extends PickType(User, ['email', 'password'] as const) {}

export class SignInDto extends PickType(User, ['username', 'password'] as const) {}
