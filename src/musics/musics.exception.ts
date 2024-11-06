import { HttpStatus } from '@nestjs/common';

export const MUSIC_ERRORS = {
  MUSIC_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'MUSIC_NOT_FOUND',
    message: '음악을 찾을 수 없습니다.',
  },
  FAILED_TO_FETCH: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'FAILED_TO_FETCH',
    message: '데이터를 불러오는 데 실패했습니다.',
  },
};
