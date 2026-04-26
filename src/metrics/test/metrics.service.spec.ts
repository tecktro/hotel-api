import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MetricsService } from '../metrics.service';
import { ROOM_TYPE } from '../../common/roomType.enum';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('http://external.test'),
          },
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('adds prices only for the selected room type', () => {
    const result = service.addSelectedTypeRoomsAndPrices(
      {
        hotel: {
          rooms: [
            {
              room_id: 'room-1',
              room_name: 'Deluxe',
              room_type: ROOM_TYPE.BUSINESS,
            },
            {
              room_id: 'room-2',
              room_name: 'Standard',
              room_type: ROOM_TYPE.RESIDENTIAL,
            },
          ],
        },
        prices: {
          'room-1': [
            [{ date: '2026-04-25', competitor: { price: 100, tax: 10 } }],
          ],
        },
      },
      ROOM_TYPE.BUSINESS,
    );

    expect(result).toEqual([
      {
        prices: { date: '2026-04-25', competitor: { price: 100, tax: 10 } },
        room_id: 'room-1',
        room_name: 'Deluxe',
        room_type: ROOM_TYPE.BUSINESS,
      },
    ]);
  });

  it('computes best, average and worst competitor prices', () => {
    const prices = {
      date: '2026-04-25',
      hotel_a: { price: 90, tax: 10 },
      hotel_b: { price: 120, tax: 20 },
      hotel_c: { price: 100, tax: 15 },
    };

    expect(service.getBest(prices)).toMatchObject({
      competitor_name: 'hotel_a',
    });
    expect(service.getAverage(prices)).toMatchObject({
      competitor_name: 'hotel_c',
    });
    expect(service.getWorst(prices)).toMatchObject({
      competitor_name: 'hotel_b',
    });
  });
});
