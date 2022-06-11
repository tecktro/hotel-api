import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ROOM_TYPE } from 'src/common/roomType.enum';
import { GetMetricInput } from './dto/getMetric.input';

@Injectable()
export class MetricsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  async getMetrics(metricInput: GetMetricInput) {
    const dataAPI = await this.fetchApiData(metricInput);

    const hotelData = this.addSelectedTypeRoomsAndPrices(
      dataAPI,
      metricInput.room_type,
    );

    const rooms = await Promise.all(
      hotelData.map(async room => this.resolveMetrics(metricInput.day, room)),
    );

    return { room: rooms };
  }

  async fetchApiData(metricInput: GetMetricInput) {
    const hotelData = await lastValueFrom(
      this.httpService.get(
        `${this.config.get('EXTERNAL_API')}/${metricInput.hotel_id}`,
      ),
    );
    const pricesData = await lastValueFrom(
      this.httpService.get(
        `${this.config.get('EXTERNAL_API')}/${metricInput.hotel_id}/prices`,
        {
          params: {
            start_date: metricInput.day,
            end_date: metricInput.day,
          },
        },
      ),
    );

    return { hotel: hotelData.data, prices: pricesData.data.prices };
  }

  addSelectedTypeRoomsAndPrices(hotelData, room_type: ROOM_TYPE) {
    return hotelData.hotel.rooms.reduce((acc, cur) => {
      if (cur.room_type === room_type) {
        cur.prices = hotelData.prices[cur.room_id][0][0];
        acc.push(cur);
      }
      return acc;
    }, []);
  }

  async resolveMetrics(day, room) {
    if (!room) {
      return {};
    }

    return {
      room_id: room.room_id,
      room_name: room.room_name,
      date: day,
      metrics: {
        best_price: this.getBest(room.prices),
        average_price: this.getAverage(room.prices),
        worst_price: this.getWorst(room.prices),
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
        net_amount: prices[e].price - (prices[e].price * (prices[e].tax / 100)),
      };
    }, []);
  }
}
