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
      });
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
