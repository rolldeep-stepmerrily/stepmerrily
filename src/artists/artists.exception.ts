import { HttpStatus } from '@nestjs/common';

export const ARTIST_ERRORS = {
  ARTIST_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'ARTIST_NOT_FOUND',
    message: '아티스트를 찾을 수 없습니다.',
  },
  DUPLICATED_ARTIST: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_ARTIST',
    message: '이미 등록된 아티스트 입니다.',
  },
};
