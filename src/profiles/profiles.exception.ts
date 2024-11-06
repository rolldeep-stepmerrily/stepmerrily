import { HttpStatus } from '@nestjs/common';

export const PROFILE_ERRORS = {
  PROFILE_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND',
    message: '프로필을 찾을 수 없습니다.',
  },
  NICKNAME_UNCHANGED: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'INVALID_NICKNAME',
    message: '기존 닉네임과 변경하려는 닉네임이 동일합니다.',
  },
  DUPLICATED_NICKNAME: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_NICKNAME',
    message: '이미 사용 중인 닉네임입니다.',
  },
  MUSIC_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'MUSIC_NOT_FOUND',
    message: '음악을 찾을 수 없습니다.',
  },
  INSTRUMENT_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'INSTRUMENT_NOT_FOUND',
    message: '악기를 찾을 수 없습니다.',
  },
};
