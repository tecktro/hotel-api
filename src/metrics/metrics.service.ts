import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ROOM_TYPE } from '../common/roomType.enum';
import { GetMetricInput } from './dto/getMetric.input';
import {
  ICompetitorPrice,
  IHotelApiData,
  IResolvedMetrics,
  IRoom,
} from './interfaces/metrics.interface';

@Injectable()
export class MetricsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  async getMetrics(
    metricInput: GetMetricInput,
  ): Promise<{ room: IResolvedMetrics[] }> {
    const dataAPI = await this.fetchApiData(metricInput);

    const hotelData = this.addSelectedTypeRoomsAndPrices(
      dataAPI,
      metricInput.room_type,
    );

    const rooms = await Promise.all(
      hotelData.map(async room => this.resolveMetrics(metricInput.day, room)),
    );

    return {
      room: rooms.filter(
        (room): room is IResolvedMetrics => Object.keys(room).length > 0,
      ),
    };
  }

  async fetchApiData(metricInput: GetMetricInput): Promise<IHotelApiData> {
    const baseUrl = this.config.getOrThrow<string>('EXTERNAL_API');

    const hotelData = await lastValueFrom(
      this.httpService.get(`${baseUrl}/${metricInput.hotel_id}`),
    );
    const pricesData = await lastValueFrom(
      this.httpService.get(`${baseUrl}/${metricInput.hotel_id}/prices`, {
        params: {
          start_date: metricInput.day,
          end_date: metricInput.day,
        },
      }),
    );

    return { hotel: hotelData.data, prices: pricesData.data.prices };
  }

  addSelectedTypeRoomsAndPrices(
    hotelData: IHotelApiData,
    roomType: ROOM_TYPE,
  ): IRoom[] {
    return hotelData.hotel.rooms.reduce<IRoom[]>((acc, room) => {
      if (room.room_type === roomType) {
        room.prices = hotelData.prices[room.room_id]?.[0]?.[0] ?? {};
        acc.push(room);
      }
      return acc;
    }, []);
  }

  async resolveMetrics(
    day: string,
    room: IRoom,
  ): Promise<IResolvedMetrics | Record<string, never>> {
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

  getBest(prices: Record<string, any>): ICompetitorPrice | null {
    const data = this.convertToCompetitorData(prices);
    if (data.length === 0) {
      return null;
    }
    const minPrice = Math.min(...data.map(e => e.gross_amount));
    return data.find(e => e.gross_amount === minPrice) ?? null;
  }

  getAverage(prices: Record<string, any>): ICompetitorPrice | null {
    const data = this.convertToCompetitorData(prices);
    if (data.length === 0) {
      return null;
    }

    const priceGoal =
      data.reduce((prev, curr) => prev + curr.gross_amount, 0) / data.length;

    const averageResult = data.reduce((prev, curr) => {
      const current = Math.abs(curr.gross_amount - priceGoal);
      const previous = Math.abs(prev.gross_amount - priceGoal);
      return current < previous ? curr : prev;
    });

    return averageResult;
  }

  getWorst(prices: Record<string, any>): ICompetitorPrice | null {
    const data = this.convertToCompetitorData(prices);
    if (data.length === 0) {
      return null;
    }
    const maxPrice = Math.max(...data.map(e => e.gross_amount));
    return data.find(e => e.gross_amount === maxPrice) ?? null;
  }

  convertToCompetitorData(prices: Record<string, any>): ICompetitorPrice[] {
    const { date: _unusedDate, ...competitors } = prices;

    return Object.entries(competitors).map(
      ([competitorName, competitorData]) => {
        const competitorInfo = competitorData as Record<string, number>;
        const grossAmount = competitorInfo.price ?? 0;
        const taxRate = competitorInfo.tax ?? 0;
        const netAmount = grossAmount - grossAmount * (taxRate / 100);

        return {
          competitor_name: competitorName,
          gross_amount: grossAmount,
          net_amount: netAmount,
        };
      },
    );
  }
}
