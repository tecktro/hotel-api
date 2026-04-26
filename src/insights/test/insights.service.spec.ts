import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { PERIOD } from '../../common/period.enum';
import { ROOM_TYPE } from '../../common/roomType.enum';
import { InsightsService } from '../insights.service';

describe('InsightsService', () => {
  let service: InsightsService;
  let httpService: { get: jest.Mock };

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
        {
          provide: HttpService,
          useValue: httpService,
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('http://external.test'),
          },
        },
      ],
    }).compile();

    service = module.get<InsightsService>(InsightsService);
  });

  it('builds a room insight with the requested limit', async () => {
    httpService.get
      .mockReturnValueOnce(
        of({
          data: {
            rooms: [
              {
                room_id: 'room-1',
                room_name: 'Business Suite',
                room_type: ROOM_TYPE.BUSINESS,
              },
            ],
          },
        }),
      )
      .mockReturnValueOnce(
        of({
          data: {
            prices: {
              'room-1': [
                [
                  {
                    date: '2026-04-01',
                    hotel_a: { currency: 1, price: 100, tax: 10 },
                    hotel_b: { currency: 1, price: 90, tax: 5 },
                  },
                ],
              ],
            },
          },
        }),
      );

    const result = await service.getInsights({
      hotel_id: 'hotel-1',
      limit: 1,
      period: PERIOD.DAYS_30,
      room_type: ROOM_TYPE.BUSINESS,
    });

    expect(result).toMatchObject({
      room: {
        room_id: 'room-1',
        room_name: 'Business Suite',
        room_type: ROOM_TYPE.BUSINESS,
        prices: [
          {
            amount: 90,
            competitor_name: 'hotel_b',
            date: '2026-04-01',
          },
        ],
      },
    });
  });

  it('calculates date ranges from the requested period', () => {
    expect(
      service.getDateRange(
        PERIOD.DAYS_30,
        new Date('2026-04-25T00:00:00.000Z'),
      ),
    ).toEqual({
      endDate: '2026-04-25',
      startDate: '2026-03-26',
    });
  });
});
