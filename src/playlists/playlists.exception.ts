import { HttpStatus } from '@nestjs/common';

export const PLAYLIST_ERRORS = {
  PLAYLIST_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'PLAYLIST_NOT_FOUND',
    message: '플레이리스트를 찾을 수 없습니다.',
  },
  INVALID_USER: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'INVALID_USER',
    message: '작성자 외에 권한이 없는 요청입니다.',
  },
};
