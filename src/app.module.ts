import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { BabyModule } from './modules/baby/baby.module';
import { environment } from './environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RootController } from './files/root.controller';
import { LoggerMiddleware } from './middleware/logger';

@Module({
  controllers: [RootController],

  imports: [
    AuthModule,
    // ProxyMiddlewareModule,
    BabyModule,
    TypeOrmModule.forRoot(environment.typeormConfig as any)
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
