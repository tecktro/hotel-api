import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsPositive } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { ROOM_TYPE } from '../../common/roomType.enum';

@InputType()
export class GetMetricInput {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Field(type => Int)
  hotel_id: number;

  @IsDateString()
  @Field()
  day: string;

  @IsEnum(ROOM_TYPE)
  @Field(type => ROOM_TYPE)
  room_type: ROOM_TYPE;
}
