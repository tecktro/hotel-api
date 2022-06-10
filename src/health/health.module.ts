import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthResolver } from './health.resolver';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [HealthResolver],
})
export class HealthModule {}
