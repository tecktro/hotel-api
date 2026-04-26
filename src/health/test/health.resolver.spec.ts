import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { HealthResolver } from '../health.resolver';

describe('HealthResolver', () => {
  let resolver: HealthResolver;
  let health: { check: jest.Mock };
  let http: { pingCheck: jest.Mock };
  let mongoose: { pingCheck: jest.Mock };

  beforeEach(() => {
    health = {
      check: jest.fn(),
    };
    http = {
      pingCheck: jest.fn(),
    };
    mongoose = {
      pingCheck: jest.fn(),
    };

    resolver = new HealthResolver(
      health as unknown as HealthCheckService,
      http as unknown as HttpHealthIndicator,
      mongoose as unknown as MongooseHealthIndicator,
      {
        get: jest.fn().mockReturnValue('http://external.test'),
      } as unknown as ConfigService,
    );
  });

  it('returns the aggregated health statuses', async () => {
    mongoose.pingCheck.mockResolvedValue({ mongoose: { status: 'up' } });
    http.pingCheck.mockResolvedValue({ 'external-api': { status: 'up' } });
    health.check
      .mockResolvedValueOnce({ status: 'ok' })
      .mockResolvedValueOnce({ status: 'ok' });

    await expect(resolver.ping()).resolves.toEqual({
      db: 'ok',
      external_api: 'ok',
      local_api: 'ok',
    });
  });
});
