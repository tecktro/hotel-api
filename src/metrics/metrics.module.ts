import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MetricsResolver } from './metrics.resolver';
import { MetricsService } from './metrics.service';

@Module({
  imports: [HttpModule, JwtModule],
  providers: [MetricsResolver, MetricsService],
})
export class MetricsModule {}
