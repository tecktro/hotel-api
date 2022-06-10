import { SetMetadata, UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Ping } from './models/ping.model';

@Resolver(of => Ping)
export class HealthResolver {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['public'])
  @Query(returns => Ping)
  @HealthCheck()
  async ping() {
    const database = await this.health.check([
      async () => this.mongoose.pingCheck('mongoose'),
    ]);
    return {
      db: database.status,
      local_api: 'ok',
      external_api: 'ok',
    };
  }
}
