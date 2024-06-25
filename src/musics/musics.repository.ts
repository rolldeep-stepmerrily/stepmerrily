import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MusicsRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
