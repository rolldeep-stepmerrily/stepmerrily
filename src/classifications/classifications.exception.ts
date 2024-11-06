import { HttpStatus } from '@nestjs/common';

export const CLASSIFICATIONS_ERRORS = {
  CLASSIFICATION_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'CLASSIFICATION_NOT_FOUND',
    message: '분류를 찾을 수 없습니다.',
  },
};
