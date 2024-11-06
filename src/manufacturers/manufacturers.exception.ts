import { HttpStatus } from '@nestjs/common';

export const MANUFACTURER_ERRORS = {
  DUPLICATED_MANUFACTURER: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_MANUFACTURER',
    message: '이미 등록된 제조사입니다.',
  },
  MANUFACTURER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'MANUFACTURER_NOT_FOUND',
    message: '제조사가 존재하지 않습니다.',
  },
};
