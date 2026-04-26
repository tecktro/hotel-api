import { Field, ObjectType } from '@nestjs/graphql';
import { MetricPrice } from './metricPrice.model';

@ObjectType()
export class Metric {
  @Field(type => MetricPrice, { nullable: true })
  best_price: MetricPrice;

  @Field(type => MetricPrice, { nullable: true })
  average_price: MetricPrice;

  @Field(type => MetricPrice, { nullable: true })
  worst_price: MetricPrice;
}
