import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const { NODE_ENV } = process.env;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ log: NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'] });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
