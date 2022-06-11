import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotels, HotelsDocument } from 'src/common/schemas/hotels.schema';
import { Prices, PricesDocument } from 'src/common/schemas/prices.schema';
import { GetMetricInput } from './dto/getMetric.input';

@Injectable()
export class MetricsService {
  constructor(
    @InjectModel(Prices.name) private priceModel: Model<PricesDocument>,
    @InjectModel(Hotels.name) private hotelModel: Model<HotelsDocument>,
  ) {}

  async getMetrics(metricInput: GetMetricInput) {
    const hotelResult = await this.hotelModel
      .aggregate([
        { $match: { hotel_id: metricInput.hotel_id } },
        {
          $project: {
            hotel_id: 1,
            name: 1,
            city: 1,
            state: 1,
            rooms: {
              $filter: {
                input: '$rooms',
                as: 'rooms',
                cond: { $eq: ['$$rooms.room_type', metricInput.room_type] },
              },
            },
          },
        },
      ])
      .exec();

    const rooms = await Promise.all(
      hotelResult[0].rooms.map(async room =>
        this.resolveMetrics(metricInput.day, room),
      ),
    );

    return { room: rooms };
  }

  async resolveMetrics(day, room) {
    const requiredDate = new Date(day);

    const roomPrices = await this.priceModel
      .aggregate([
        { $match: { room_id: room.room_id } },
        {
          $project: {
            room_id: 1,
            prices: {
              $filter: {
                input: '$prices',
                as: 'prices',
                cond: {
                  $and: [
                    { $gt: ['$$prices.date', requiredDate] },
                    {
                      $lt: [
                        '$$prices.date',
                        new Date(requiredDate.getTime() + 86400000),
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ])
      .exec();

    if (!roomPrices.length) {
      return {};
    }

    return {
      room_id: room.room_id,
      room_name: room.room_name,
      date: day,
      metrics: {
        best_price: this.getBest(roomPrices[0].prices[0]),
        average_price: this.getAverage(roomPrices[0].prices[0]),
        worst_price: this.getWorst(roomPrices[0].prices[0]),
      },
    };
  }

  getBest(prices) {
    const data = this.convertToCompetitorData(prices);
    const minPrice = Math.min(...data.map(e => e.gross_amount));
    return data.find(e => e.gross_amount === minPrice);
  }

  getAverage(prices) {
    const data = this.convertToCompetitorData(prices);

    // total average prices
    const priceGoal =
      data.reduce((prev, curr) => prev + curr.gross_amount, 0) / data.length;

    // calculate closest diference of previous total average price
    const averageResult = data.reduce((prev, curr) => {
      const current = Math.abs(curr.gross_amount - priceGoal);
      const previous = Math.abs(prev.gross_amount - priceGoal);
      return current < previous ? curr : prev;
    });

    return averageResult;
  }
  getWorst(prices) {
    const data = this.convertToCompetitorData(prices);
    const maxPrice = Math.max(...data.map(e => e.gross_amount));
    return data.find(e => e.gross_amount === maxPrice);
  }

  convertToCompetitorData(prices) {
    delete prices.date;
    return Object.keys(prices).map(e => {
      return {
        competitor_name: e,
        gross_amount: prices[e].price,
        // eslint-disable-next-line prettier/prettier
        net_amount: prices[e].price - prices[e].price * (prices[e].tax / 100),
      };
    }, []);
  }
}
