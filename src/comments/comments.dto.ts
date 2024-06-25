import { PickType } from '@nestjs/swagger';

import { Comment } from './entities/comment.entity';

export class CreateCommentDto extends PickType(Comment, ['postId', 'commentId', 'content'] as const) {}

export class UpdateCommentDto extends PickType(Comment, ['content'] as const) {}
