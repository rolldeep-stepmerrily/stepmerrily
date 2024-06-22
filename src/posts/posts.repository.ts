import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    try {
      return await this.prismaService.post.create({
        data: {
          userId,
          ...createPostDto,
        },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findLastPost() {
    try {
      return await this.prismaService.post.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }

  async findPosts(postId?: number) {
    try {
      return await this.prismaService.post.findMany({
        where: { deletedAt: null },
        take: 21,
        skip: postId ? 1 : 0,
        ...(postId && { cursor: { id: postId } }),
        select: { id: true, title: true, views: true, likes: true, createdAt: true },
        orderBy: { id: 'desc' },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
  async findPost(postId: number) {
    try {
      return await this.prismaService.post.update({
        where: { id: postId },
        data: { views: { increment: 1 } },
        select: {
          id: true,
          user: { select: { avatar: true, nickname: true } },
          title: true,
          content: true,
          images: true,
          views: true,
          likes: true,
          createdAt: true,
        },
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
