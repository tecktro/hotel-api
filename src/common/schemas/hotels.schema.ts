import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelsDocument = Hotels & Document;

@Schema()
export class Hotels {
  @Prop()
  hotel_id: number;

  @Prop()
  name: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  rooms: [any];
}

export const HotelSchema = SchemaFactory.createForClass(Hotels);
