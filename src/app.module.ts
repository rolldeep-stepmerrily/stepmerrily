import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import Joi from 'joi';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { HttpLoggerMiddleware } from './common/middlewares';
import { AppController } from './app.controller';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { MusicsModule } from './musics/musics.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVER_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'provision').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        ADMIN_NAME: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        EMAIL_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_S3_BUCKET: Joi.string().required(),
        AWS_CLOUDFRONT_DOMAIN: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        GIT_ACCEESS_TOKEN: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    PrismaModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: { host: REDIS_HOST, port: REDIS_PORT },
      password: REDIS_PASSWORD,
      ttl: 5 * 60 * 1000,
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    MusicsModule,
    ArtistsModule,
    AlbumsModule,
    PlaylistsModule,
    ClassificationsModule,
    InstrumentsModule,
    ManufacturersModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
