import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthTokenDecypherInterceptor } from './_helper/auth-token-decypher.interceptor';
import * as bodyParser from 'body-parser';
import { DataValidationInterceptor } from './interceptor/validation.interceptor';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalInterceptors(new AuthTokenDecypherInterceptor());
  app.useGlobalInterceptors(new DataValidationInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Beba')
    .setDescription('Beba app')
    .setVersion('1.0.11')
    .setTermsOfService('http://placeholder')
    .setContact("Apeex", 'urlToAPex', 'bebahealthapp@gmail.com')
    .setLicense('Apache 2.0', 'http://www.apache.org/licenses/LICENSE-2.0.html')
    .addTag('beba')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8080, '0.0.0.0');
}
bootstrap();
