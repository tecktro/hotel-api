import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MetricPrice {
  @Field({ nullable: true })
  competitor_name: string;

  @Field(type => Float, { nullable: true })
  gross_amount: number;

  @Field(type => Float, { nullable: true })
  net_amount: number;
}
