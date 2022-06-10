import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotels, HotelsDocument } from 'src/common/schemas/hotels.schema';
import { Prices, PricesDocument } from 'src/common/schemas/prices.schema';

@Injectable()
export class InsightsService {
  constructor(
    @InjectModel(Prices.name) private priceModel: Model<PricesDocument>,
    @InjectModel(Hotels.name) private hotelModel: Model<HotelsDocument>,
  ) {}

  getInsights(input) {
    return null;
  }
}
