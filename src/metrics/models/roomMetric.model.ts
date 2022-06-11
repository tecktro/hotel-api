import { Field, ObjectType } from '@nestjs/graphql';
import { Metric } from './metric.model';

@ObjectType()
export class RoomMetric {
  @Field({ nullable: true })
  room_id: string;

  @Field({ nullable: true })
  room_name: string;

  @Field({ nullable: true })
  date: string;

  @Field(type => Metric, { nullable: true })
  metrics: Metric;
}
