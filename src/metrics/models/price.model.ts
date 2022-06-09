import { Field, Float } from '@nestjs/graphql';

export class Price {
  @Field()
  competitor_name: string;

  @Field(type => Float)
  currency: number;

  @Field(type => Float)
  taxes: number;

  @Field(type => Float)
  amount: number;

  @Field()
  date: string;
}
