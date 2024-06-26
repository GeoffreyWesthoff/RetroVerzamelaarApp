import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from '../../schemas/user.schema';
import { ConsoleService } from '../console/console.service';
import { GameService } from '../game/game.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, ConsoleService, GameService],
})
export class UserModule {}
