import { CACHE_MANAGER, Inject, SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetMetricInput } from './dto/getMetric.input';
import { MetricsService } from './metrics.service';
import { HotelMetric } from './models/hotelMetric.model';
import { Cache } from 'cache-manager';

@Resolver(of => HotelMetric)
export class MetricsResolver {
  constructor(
    private metricService: MetricsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['manager'])
  @Query(returns => HotelMetric, { nullable: true })
  async getHotelMetrics(@Args('getMetricInput') metricInput: GetMetricInput) {
    const cacheKey = `${metricInput.hotel_id}-${metricInput.room_type}-${metricInput.day}`;
    let result = await this.cacheManager.get(cacheKey);
    if (!result) {
      result = await this.metricService.getMetrics(metricInput);
      await this.cacheManager.set(cacheKey, result);
    }
    return result;
  }
}
