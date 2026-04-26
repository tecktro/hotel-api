import { Field, ObjectType } from '@nestjs/graphql';
import { Price } from './price.model';

@ObjectType()
export class RoomInsight {
  @Field()
  room_id: string;

  @Field()
  room_name: string;

  @Field()
  room_type: string;

  @Field(type => [Price])
  prices: Price[];

  @Field()
  last_updated_at: string;
}
