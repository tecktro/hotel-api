import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { getJwtSecret } from './constants';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';
import { Users, UserSchema } from './schemas/users.schema';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
  ],
  providers: [AuthService, JwtAuthGuard, LocalAuthGuard, LocalStrategy],
  exports: [AuthService, JwtAuthGuard, JwtModule, LocalAuthGuard],
})
export class AuthModule {}
