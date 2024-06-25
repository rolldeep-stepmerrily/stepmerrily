import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstrumentsRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
