import { HttpStatus } from '@nestjs/common';

export const COMMENT_ERRORS = {
  POST_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'POST_NOT_FOUND',
    message: '게시글을 찾을 수 없습니다.',
  },
  COMMENT_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'COMMENT_NOT_FOUND',
    message: '댓글을 찾을 수 없습니다.',
  },
  INVALID_COMMENT: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'INVALID_COMMENT',
    message: '대댓글에 대한 대댓글은 달 수 없습니다.',
  },
  INVALID_USER: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'INVALID_USER',
    message: '작성자 외에 권한이 없는 요청입니다.',
  },
};
