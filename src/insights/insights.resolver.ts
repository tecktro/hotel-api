import { SetMetadata, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HotelInsight } from './models/hotelInsight.model';

@Resolver(of => HotelInsight)
export class InsightsResolver {
  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['manager'])
  @Query(returns => HotelInsight, { nullable: true })
  getHotelInsights() {
    return { room: { room_id: 'asdas' } };
  }
}
