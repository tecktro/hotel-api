import { Field } from '@nestjs/graphql';
import { RoomInsight } from './roomInsight.model';

export class HotelInsight {
  @Field(type => RoomInsight)
  room: RoomInsight;
}
