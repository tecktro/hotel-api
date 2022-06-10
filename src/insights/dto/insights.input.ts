import { Field, InputType, Int } from '@nestjs/graphql';
import { PERIOD } from 'src/common/period.enum';
import { ROOM_TYPE } from 'src/common/roomType.enum';

@InputType()
export class GetInsightsInput {
  @Field()
  hotel_id: string;

  @Field(type => PERIOD)
  period: PERIOD;

  @Field(type => ROOM_TYPE)
  room_type: ROOM_TYPE;

  @Field(type => Int)
  limit: number;
}
