import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PricesDocument = Prices & Document;

@Schema()
export class Prices {
  @Prop()
  room_id: string;

  @Prop()
  prices: [any];
}

export const PriceSchema = SchemaFactory.createForClass(Prices);
