import { ROOM_TYPE } from '../../common/roomType.enum';
import { MetricsResolver } from '../metrics.resolver';

describe('MetricsResolver', () => {
  let resolver: MetricsResolver;
  let cacheManager: { get: jest.Mock; set: jest.Mock };
  let metricsService: { getMetrics: jest.Mock };

  beforeEach(() => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };
    metricsService = {
      getMetrics: jest.fn(),
    };

    resolver = new MetricsResolver(metricsService as any, cacheManager as any);
  });

  it('returns a cached metric result when present', async () => {
    const input = {
      day: '2026-04-25',
      hotel_id: 7,
      room_type: ROOM_TYPE.BUSINESS,
    };
    const cached = { room: [] };
    cacheManager.get.mockResolvedValue(cached);

    await expect(resolver.getHotelMetrics(input)).resolves.toEqual(cached);
    expect(metricsService.getMetrics).not.toHaveBeenCalled();
  });

  it('caches freshly computed metric results', async () => {
    const input = {
      day: '2026-04-25',
      hotel_id: 7,
      room_type: ROOM_TYPE.BUSINESS,
    };
    const result = { room: [{ room_id: 'room-1' }] };
    cacheManager.get.mockResolvedValue(undefined);
    metricsService.getMetrics.mockResolvedValue(result);

    await expect(resolver.getHotelMetrics(input)).resolves.toEqual(result);
    expect(cacheManager.set).toHaveBeenCalledWith(
      '7-business-2026-04-25',
      result,
      60000,
    );
  });
});
