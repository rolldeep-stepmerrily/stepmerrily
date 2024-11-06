import { HttpStatus } from '@nestjs/common';

export const ALBUM_ERRORS = {
  ALBUM_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'ALBUM_NOT_FOUND',
    message: '앨범을 찾을 수 없습니다.',
  },
};
