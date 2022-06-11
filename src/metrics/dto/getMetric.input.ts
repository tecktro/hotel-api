import { Field, InputType, Int } from '@nestjs/graphql';
import { ROOM_TYPE } from 'src/common/roomType.enum';

@InputType()
export class GetMetricInput {
  @Field(type => Int)
  hotel_id: number;

  @Field()
  day: string;

  @Field(type => ROOM_TYPE)
  room_type: ROOM_TYPE;
}
