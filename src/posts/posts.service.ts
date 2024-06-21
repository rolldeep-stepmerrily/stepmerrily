import { Injectable } from '@nestjs/common';

import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    return this.postsRepository.createPost(userId, createPostDto);
  }
}
