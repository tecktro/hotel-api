import { Field, ObjectType } from '@nestjs/graphql';
import { RoomInsight } from './roomInsight.model';

@ObjectType()
export class HotelInsight {
  @Field(type => RoomInsight)
  room: RoomInsight;
}
