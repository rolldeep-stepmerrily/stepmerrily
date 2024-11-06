import { HttpStatus } from '@nestjs/common';

export const USER_ERRORS = {
  DUPLICATED_USERNAME: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_USERNAME',
    message: '이미 존재하는 아이디 입니다.',
  },
  DUPLICATED_EMAIL: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_EMAIL',
    message: '해당 이메일로 가입된 계정이 존재합니다.',
  },
  DUPLICATED_NICKNAME: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_NICKNAME',
    message: '해당 닉네임으로 가입된 계정이 존재합니다.',
  },
  DUPLICATED_PHONE_NUMBER: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_PHONE_NUMBER',
    message: '해당 전화번호로 가입된 계정이 존재합니다.',
  },
  INVALID_TERMS: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'INVALID_TERMS',
    message: '약관에 동의해주세요.',
  },
  UNAUTHORIZED_EMAIL: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'UNAUTHORIZED_EMAIL',
    message: '이메일 인증을 진행해주세요.',
  },
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND',
    message: '유저를 찾을 수 없습니다.',
  },
  WITHDRAWAL_USER: {
    statusCode: HttpStatus.GONE,
    errorCode: 'WITHDRAWAL_USER',
    message: '탈퇴한 회원입니다.',
  },
};
