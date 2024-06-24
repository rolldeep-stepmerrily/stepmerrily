import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CommentsService } from './comments.service';
import { User } from 'src/auth/decorators';
import { CreateCommentDto } from './comments.dto';

@ApiTags('Comments')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('access'))
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '댓글 작성' })
  @Post()
  async createComment(@User('id') userId: number, @Body() createCommentDto: CreateCommentDto) {
    await this.commentsService.createComment(userId, createCommentDto);
  }
}
