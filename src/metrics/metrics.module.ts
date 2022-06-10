import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotels, HotelSchema } from 'src/common/schemas/hotels.schema';
import { Prices, PriceSchema } from 'src/common/schemas/prices.schema';
import { MetricsResolver } from './metrics.resolver';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule,
    MongooseModule.forFeature([
      { name: Prices.name, schema: PriceSchema },
      { name: Hotels.name, schema: HotelSchema },
    ]),
  ],
  providers: [MetricsResolver, MetricsService],
})
export class MetricsModule {}
