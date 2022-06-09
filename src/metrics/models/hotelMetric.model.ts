import { Field, ObjectType } from '@nestjs/graphql';
import { RoomMetric } from './roomMetric.model';

@ObjectType()
export class HotelMetric {
  @Field(type => RoomMetric)
  room: RoomMetric;
}
