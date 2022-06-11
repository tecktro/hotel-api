import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InsightsResolver } from './insights.resolver';
import { InsightsService } from './insights.service';

@Module({
  imports: [JwtModule, HttpModule],
  providers: [InsightsResolver, InsightsService],
})
export class InsightsModule {}
