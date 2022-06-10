import { Field, InputType } from '@nestjs/graphql';
import { ROOM_TYPE } from 'src/common/roomType.enum';

@InputType()
export class GetMetricInput {
  @Field()
  hotel_id: string;

  @Field()
  day: string;

  @Field(type => ROOM_TYPE)
  room_type: ROOM_TYPE;
}
