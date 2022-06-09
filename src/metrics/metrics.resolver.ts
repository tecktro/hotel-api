import { SetMetadata, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HotelMetric } from './models/hotelMetric.model';

@Resolver(of => HotelMetric)
export class MetricsResolver {
  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['manager'])
  @Query(returns => HotelMetric, { nullable: true })
  getHotelMetrics() {
    return null;
  }
}
