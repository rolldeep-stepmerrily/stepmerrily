import { HttpStatus } from '@nestjs/common';

export const INSTRUMENT_ERRORS = {
  DUPLICATED_SERIAL_NUMBER: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATED_SERIAL_NUMBER',
    message: '이미 등록된 시리얼 번호입니다.',
  },
  MINOR_CLASSIFICATION_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'MINOR_CLASSIFICATION_NOT_FOUND',
    message: '소분류가 존재하지 않습니다.',
  },
  MANUFACTURER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'MANUFACTURER_NOT_FOUND',
    message: '제조사가 존재하지 않습니다.',
  },
  INSTRUMENT_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'INSTRUMENT_NOT_FOUND',
    message: '악기가 존재하지 않습니다.',
  },
};
