import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import expressBasicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { TransfromInterceptor } from './common/interceptors';
import { HttpExceptionFilter } from './common/filters';

const { ADMIN_NAME, ADMIN_PASSWORD, PORT } = process.env;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const isProduction = process.env.NODE_ENV === 'production';

  app.useGlobalInterceptors(new TransfromInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProduction,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  if (!isProduction) {
    app.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: { [ADMIN_NAME]: ADMIN_PASSWORD },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('stepmerrily API Docs')
      .setDescription('stepmerrily API Description')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(PORT);
}
bootstrap();
