import { Field, ObjectType } from '@nestjs/graphql';
import { Metric } from './metric.model';

@ObjectType()
export class RoomMetric {
  @Field()
  room_id: string;

  @Field()
  room_name: string;

  @Field()
  date: string;

  @Field(type => [Metric])
  metrics: Metric[];

  @Field()
  last_updated_at: string;
}
