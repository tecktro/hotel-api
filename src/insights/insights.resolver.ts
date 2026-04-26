import { SetMetadata, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetInsightsInput } from './dto/insights.input';
import { InsightsService } from './insights.service';
import { HotelInsight } from './models/hotelInsight.model';

@Resolver(() => HotelInsight)
export class InsightsResolver {
  constructor(private insightsService: InsightsService) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['manager'])
  @Query(() => HotelInsight, { nullable: true })
  async getHotelInsights(
    @Args('getInsightInput') insightInput: GetInsightsInput,
  ): Promise<HotelInsight | null> {
    return this.insightsService.getInsights(insightInput);
  }
}
