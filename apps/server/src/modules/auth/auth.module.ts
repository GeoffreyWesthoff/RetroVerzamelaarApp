import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
controllers: [AuthController],
providers: [UserService],})

export class AuthModule {}
