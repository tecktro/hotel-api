import { Field } from '@nestjs/graphql';
import { MetricPrice } from './metricPrice.model';

export class Metric {
  @Field(type => MetricPrice)
  best_price: MetricPrice;

  @Field(type => MetricPrice)
  average_price: MetricPrice;

  @Field(type => MetricPrice)
  worst_price: MetricPrice;
}
