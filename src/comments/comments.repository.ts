import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './comments.dto';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(userId: number, createCommentDto: CreateCommentDto) {
    try {
      return await this.prismaService.comment.create({
        data: {
          userId,
          ...createCommentDto,
        },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findComment(commentId: number) {
    try {
      return await this.prismaService.comment.findUnique({
        where: { id: commentId, deletedAt: null },
        select: { id: true, commentId: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
