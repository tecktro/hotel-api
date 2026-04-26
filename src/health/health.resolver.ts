import { SetMetadata, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resolver, Query } from '@nestjs/graphql';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Ping } from './models/ping.model';

interface IHealthCheckResult {
  db: string;
  local_api: string;
  external_api: string;
}

@Resolver(() => Ping)
export class HealthResolver {
  constructor(
    private healthCheckService: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
    private mongooseHealthIndicator: MongooseHealthIndicator,
    private configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['public'])
  @Query(() => Ping)
  @HealthCheck()
  async ping(): Promise<IHealthCheckResult> {
    const database = await this.healthCheckService.check([
      async () => this.mongooseHealthIndicator.pingCheck('mongoose'),
    ]);
    const externalApi = await this.healthCheckService.check([
      async () =>
        this.httpHealthIndicator.pingCheck(
          'external-api',
          this.configService.get<string>('EXTERNAL_API') ??
            'http://localhost:5000',
        ),
    ]);

    return {
      db: database.status,
      local_api: 'ok',
      external_api: externalApi.status,
    };
  }
}
