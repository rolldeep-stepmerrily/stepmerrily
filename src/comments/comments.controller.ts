import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CommentsService } from './comments.service';
import { User } from 'src/auth/decorators';
import { CreateCommentDto, UpdateCommentDto } from './comments.dto';

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

  @ApiOperation({ summary: '댓글 수정' })
  @Put(':id')
  async updateComment(
    @User('id') userId: number,
    @Param('id') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    await this.commentsService.updateComment(userId, commentId, updateCommentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':id')
  async deleteComment(@User('id') userId: number, @Param('id') commentId: number) {
    await this.commentsService.deleteComment(userId, commentId);
  }
}
