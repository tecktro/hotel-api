import { PERIOD } from '../../common/period.enum';
import { ROOM_TYPE } from '../../common/roomType.enum';
import { InsightsResolver } from '../insights.resolver';

describe('InsightsResolver', () => {
  let resolver: InsightsResolver;
  let insightsService: { getInsights: jest.Mock };

  beforeEach(() => {
    insightsService = {
      getInsights: jest.fn(),
    };

    resolver = new InsightsResolver(insightsService as any);
  });

  it('delegates hotel insights retrieval to the service', async () => {
    const input = {
      hotel_id: 'hotel-1',
      limit: 5,
      period: PERIOD.DAYS_30,
      room_type: ROOM_TYPE.BUSINESS,
    };
    const result = {
      room: {
        room_id: 'r1',
      },
    };
    insightsService.getInsights.mockResolvedValue(result);

    await expect(resolver.getHotelInsights(input)).resolves.toEqual(result);
    expect(insightsService.getInsights).toHaveBeenCalledWith(input);
  });
});
