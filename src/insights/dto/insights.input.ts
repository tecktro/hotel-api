import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsPositive, IsString, Max } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { PERIOD } from '../../common/period.enum';
import { ROOM_TYPE } from '../../common/roomType.enum';

@InputType()
export class GetInsightsInput {
  @IsString()
  @Field()
  hotel_id: string;

  @IsEnum(PERIOD)
  @Field(type => PERIOD)
  period: PERIOD;

  @IsEnum(ROOM_TYPE)
  @Field(type => ROOM_TYPE)
  room_type: ROOM_TYPE;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(100)
  @Field(type => Int)
  limit: number;
}
