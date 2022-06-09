import { Field, Float } from '@nestjs/graphql';

export class MetricPrice {
  @Field()
  competitor_name: string;

  @Field(type => Float)
  gross_amount: number;

  @Field(type => Float)
  net_amount: number;
}
