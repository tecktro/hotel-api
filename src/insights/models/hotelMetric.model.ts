import { Field } from '@nestjs/graphql';
import { RoomMetric } from './roomMetric.model';

export class HotelMetric {
  @Field(type => [RoomMetric])
  room: RoomMetric[];
}
