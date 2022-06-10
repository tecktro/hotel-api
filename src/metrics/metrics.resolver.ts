import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetMetricInput } from './dto/getMetric.input';
import { MetricsService } from './metrics.service';
import { HotelMetric } from './models/hotelMetric.model';

@Resolver(of => HotelMetric)
export class MetricsResolver {
  constructor(private metricService: MetricsService) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['manager'])
  @Query(returns => HotelMetric, { nullable: true })
  async getHotelMetrics(@Args('getMetricInput') metricInput: GetMetricInput) {
    return await this.metricService.getMetrics(metricInput);
  }
}
