import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import Joi from 'joi';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { HttpLoggerMiddleware } from './common/middlewares';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        ADMIN_NAME: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        EMAIL_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    PrismaModule,
    UsersModule,
    CacheModule.register({ isGlobal: true, ttl: 5 * 60 * 1000 }),
    PostsModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
