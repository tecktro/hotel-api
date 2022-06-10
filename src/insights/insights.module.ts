import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotels, HotelSchema } from 'src/common/schemas/hotels.schema';
import { Prices, PriceSchema } from 'src/common/schemas/prices.schema';
import { InsightsResolver } from './insights.resolver';
import { InsightsService } from './insights.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Prices.name, schema: PriceSchema },
      { name: Hotels.name, schema: HotelSchema },
    ]),
  ],
  providers: [InsightsResolver, InsightsService],
})
export class InsightsModule {}
