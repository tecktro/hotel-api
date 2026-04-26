import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetMetricInput } from './dto/getMetric.input';
import { MetricsService } from './metrics.service';
import { HotelMetric } from './models/hotelMetric.model';

@Resolver(() => HotelMetric)
export class MetricsResolver {
  constructor(
    private metricsService: MetricsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['manager'])
  @Query(() => HotelMetric, { nullable: true })
  async getHotelMetrics(
    @Args('getMetricInput') metricInput: GetMetricInput,
  ): Promise<HotelMetric | null> {
    const cacheKey = `${metricInput.hotel_id}-${metricInput.room_type}-${metricInput.day}`;
    let result = await this.cacheManager.get<HotelMetric>(cacheKey);

    if (!result) {
      result = await this.metricsService.getMetrics(metricInput);
      await this.cacheManager.set(cacheKey, result, 60_000);
    }

    return result;
  }
}
