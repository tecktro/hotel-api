import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
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
