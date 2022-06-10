import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetInsightsInput } from './dto/insights.input';
import { InsightsService } from './insights.service';
import { HotelInsight } from './models/hotelInsight.model';

@Resolver(of => HotelInsight)
export class InsightsResolver {
  constructor(private insightService: InsightsService) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['manager'])
  @Query(returns => HotelInsight, { nullable: true })
  async getHotelInsights(
    @Args('getInsightInput') insightInput: GetInsightsInput,
  ) {
    return await this.insightService.getInsights(insightInput);
  }
}
