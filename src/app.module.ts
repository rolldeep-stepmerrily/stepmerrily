import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { redisStore } from 'cache-manager-redis-yet';
import Joi from 'joi';
import { RedisClientOptions } from 'redis';

import { AlbumsModule } from './albums/albums.module';
import { AppController } from './app.controller';
import { ArtistsModule } from './artists/artists.module';
import { AuthModule } from './auth/auth.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigProviderModule } from './common/config-provider/config-provider.module';
import { HttpLoggerMiddleware } from './common/middlewares';
import { InstrumentsModule } from './instruments/instruments.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { MusicsModule } from './musics/musics.module';
import { NowplayingmanModule } from './nowplayingman/nowplayingman.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVER_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'provision').default('development'),
        PORT: Joi.number().default(3065),
        DATABASE_URL: Joi.string().required(),
        ADMIN_NAME: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        GUEST_NAME: Joi.string().required(),
        GUEST_PASSWORD: Joi.string().required(),
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
        GIT_ACCESS_TOKEN: Joi.string().required(),
        LAST_FM_API_KEY: Joi.string().required(),
        LAST_FM_API_SECRET: Joi.string().required(),
        LAST_FM_API_URL: Joi.string().required(),
        THREADS_APP_ID: Joi.string().required(),
        THREADS_REDIRECT_URI: Joi.string().required(),
        THREADS_SCOPE: Joi.string().required(),
        THREADS_APP_SECRET: Joi.string().required(),
      }),
      isGlobal: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
    PrismaModule,
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        socket: {
          host: configService.getOrThrow<string>('REDIS_HOST'),
          port: configService.getOrThrow<number>('REDIS_PORT'),
        },
        password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        ttl: 5 * 60 * 1000,
      }),
      isGlobal: true,
      inject: [ConfigService],
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
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    ConfigProviderModule,
    NowplayingmanModule,
  ],
  controllers: [AppController],
  providers: [{ provide: 'APP_GUARD', useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
