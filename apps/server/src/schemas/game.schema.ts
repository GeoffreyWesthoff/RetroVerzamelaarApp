import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Game {
  @Prop()
  id: string  

  @Prop()
  name: string;

  @Prop()
  release_date: Date;

  @Prop()
  market_price: number;

  @Prop()
  image_url: string;

  @Prop()
  rating: number;

  @Prop()
  region: string;

  @Prop()
  max_players: number;

  @Prop()
  online_support: boolean;

  @Prop()
  genre: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
