import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InsightsService {
  constructor(
    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  getInsights(input) {
    return null;
  }
}
