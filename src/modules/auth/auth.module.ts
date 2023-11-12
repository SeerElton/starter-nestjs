import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../../environment';
import { AuthGuard } from '../../_helper/jwt/jwt-auth.guard';
import { AuthController } from './controllers/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BebaResetPassword } from '../../entities/reset-password.entity';
import { BebaUser } from '../../entities/user.entity';
import { ResetPasswordService } from './services/reset-password/reset-password.service';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth/auth.service';
import { BebaBabyParent } from '../../entities/baby-parent.entity';
import { toEntity } from '../../_helper/toEntity/toEntity';
import { ServeEmailerService } from '../../emails/email.sender';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    TypeOrmModule.forFeature([BebaUser, BebaResetPassword, BebaBabyParent]),
    JwtModule.register({
      global: true,
      secret: environment.jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    toEntity,
    ServeEmailerService,
    ResetPasswordService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, ResetPasswordService,
    JwtModule.register({
      global: true,
      secret: environment.jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    })
    ,],
})
export class AuthModule { }