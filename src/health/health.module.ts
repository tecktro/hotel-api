import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { HealthResolver } from './health.resolver';

@Module({
  imports: [TerminusModule, HttpModule, JwtModule],
  providers: [HealthResolver],
})
export class HealthModule {}
