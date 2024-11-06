import { HttpStatus } from '@nestjs/common';

export const AUTH_ERRORS = {
  EXCEED_MAX_AUTH_COUNT: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'EXCEED_MAX_AUTH_COUNT',
    message: '인증 횟수를 초과하였습니다.',
  },
  FAILED_TO_SEND_MAIL: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'FAILED_TO_SEND_MAIL',
    message: '메일 전송에 실패하였습니다.',
  },
  NOT_FOUND_AUTH_INFO: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'NOT_FOUND_AUTH_INFO',
    message: '해당 인증 정보를 찾을 수 없습니다.',
  },
  INVALID_AUTH_CODE: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'INVALID_AUTH_CODE',
    message: '인증 코드가 일치하지 않습니다.',
  },
  WITHDRAWAL_USER: {
    statusCode: HttpStatus.GONE,
    errorCode: 'WITHDRAWAL_USER',
    message: '탈퇴한 회원입니다.',
  },
  INVALID_PASSWORD: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'INVALID_PASSWORD',
    message: '비밀번호가 일치하지 않습니다.',
  },
  FORBIDDEN_REQUEST: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'FORBIDDEN_REQUEST',
    message: '허용되지 않은 요청입니다.',
  },
};
