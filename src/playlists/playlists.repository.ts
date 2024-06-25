import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistsRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
