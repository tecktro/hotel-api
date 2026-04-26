import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PERIOD } from '../common/period.enum';
import { ROOM_TYPE } from '../common/roomType.enum';
import { GetInsightsInput } from './dto/insights.input';
import {
  ICompetitorPriceEntry,
  IDateRange,
  IInsightsResponse,
  IRoomInsight,
} from './interfaces/insights.interface';

interface IHotelApiData {
  hotel: {
    rooms: Array<{
      room_id: string;
      room_name: string;
      room_type: string;
    }>;
  };
  prices: Record<string, any[][]>;
}

@Injectable()
export class InsightsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  async getInsights(
    input: GetInsightsInput,
  ): Promise<IInsightsResponse | null> {
    const hotelData = await this.fetchApiData(input);
    const room = this.getRoomInsight(hotelData, input.room_type, input.limit);

    if (!room) {
      return null;
    }

    return {
      room,
    };
  }

  async fetchApiData(input: GetInsightsInput): Promise<IHotelApiData> {
    const { startDate, endDate } = this.getDateRange(input.period);
    const baseUrl = this.config.getOrThrow<string>('EXTERNAL_API');

    const hotelData = await lastValueFrom(
      this.httpService.get(`${baseUrl}/${input.hotel_id}`),
    );
    const pricesData = await lastValueFrom(
      this.httpService.get(`${baseUrl}/${input.hotel_id}/prices`, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }),
    );

    return {
      hotel: hotelData.data,
      prices: pricesData.data.prices,
    };
  }

  getRoomInsight(
    hotelData: IHotelApiData,
    roomType: ROOM_TYPE,
    limit: number,
  ): IRoomInsight | null {
    const room = hotelData.hotel.rooms.find(
      room => room.room_type === roomType,
    );
    if (!room) {
      return null;
    }

    return {
      room_id: room.room_id,
      room_name: room.room_name,
      room_type: room.room_type,
      prices: this.formatRoomPrices(hotelData.prices[room.room_id], limit),
      last_updated_at: new Date().toISOString(),
    };
  }

  formatRoomPrices(
    roomPrices: any[][] = [],
    limit = 10,
  ): ICompetitorPriceEntry[] {
    return roomPrices
      .flatMap(group => (Array.isArray(group) ? group : [group]))
      .filter(snapshot => snapshot && typeof snapshot === 'object')
      .flatMap(snapshot => this.mapSnapshotPrices(snapshot))
      .sort((left, right) => left.amount - right.amount)
      .slice(0, limit);
  }

  mapSnapshotPrices(snapshot: Record<string, any>): ICompetitorPriceEntry[] {
    const { date, ...competitors } = snapshot;

    return Object.entries(competitors).map(([competitorName, priceData]) => {
      const price = priceData as Record<string, any>;
      return {
        competitor_name: competitorName,
        currency: price.currency ?? 0,
        taxes: price.tax ?? 0,
        amount: price.price ?? 0,
        date: date ?? new Date().toISOString().slice(0, 10),
      };
    });
  }

  getDateRange(period: PERIOD, today: Date = new Date()): IDateRange {
    const daysByPeriod: Record<PERIOD, number> = {
      [PERIOD.DAYS_30]: 30,
      [PERIOD.DAYS_60]: 60,
      [PERIOD.DAYS_90]: 90,
    };
    const endDate = this.toDateString(today);
    const start = new Date(today);
    start.setUTCDate(start.getUTCDate() - daysByPeriod[period]);

    return {
      startDate: this.toDateString(start),
      endDate,
    };
  }

  toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
