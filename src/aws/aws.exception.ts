import { HttpStatus } from '@nestjs/common';

export const AWS_ERRORS = {
  FAILED_TO_UPLOAD_FILE: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'FAILED_TO_UPLOAD_FILE',
    message: '파일 업로드에 실패하였습니다.',
  },
};
