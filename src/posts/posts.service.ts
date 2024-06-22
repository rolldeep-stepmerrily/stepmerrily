import { Injectable, NotFoundException } from '@nestjs/common';

import { PostsRepository } from './posts.repository';
import { AwsService } from 'src/aws/aws.service';
import { CreatePostDto, CreatePostImagesDto } from './posts.dto';

const { AWS_CLOUDFRONT_DOMAIN } = process.env;

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly awsService: AwsService,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto, createPostImagesDto: CreatePostImagesDto) {
    if (createPostImagesDto.length > 0) {
      const lastPost = await this.postsRepository.findLastPost();

      const lastPostId = lastPost?.id ?? 0;

      const uploadPath = `users/${userId}/posts/${lastPostId + 1}`;

      await this.awsService.uploadImages(createPostImagesDto, uploadPath);

      return this.postsRepository.createPost(userId, { ...createPostDto, images: uploadPath });
    }

    return this.postsRepository.createPost(userId, createPostDto);
  }

  async findPost(id: number) {
    const post = await this.postsRepository.findPost(id);

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const findImages = post.images ? await this.awsService.findImages(post.images) : null;

    const images = findImages?.map((image) => `${AWS_CLOUDFRONT_DOMAIN}/${image.Key}`) ?? null;

    return { ...post, images };
  }
}
