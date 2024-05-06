import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Collectable } from 'src/modules/user/dto/collected-game-dto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  @Prop()
  username: string;

  @Prop()
  password_hash: string;

  @Prop()
  owned_games: Collectable[];
  
  @Prop()
  owned_consoles: Collectable[]

  @Prop()
  admin: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);
