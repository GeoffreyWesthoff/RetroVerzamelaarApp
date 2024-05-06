import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
} from '../../schemas/user.schema';
import { CreateUserDto, EditUserDto } from './dto/create-user-dto';
import { Collectable } from './dto/collected-game-dto';
import { Game } from 'src/schemas/game.schema';
import { Console } from 'src/schemas/console.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser.save();
  }

  async findUserWithHash(username: string): Promise<User> {
    return this.userModel.findOne({username: username}, {"__v": 0}).exec();
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({username: username}, {password_hash: 0, "__v": 0}).exec();
  }

  async userExists(username: string): Promise<Boolean> {
    const exists = await this.userModel.exists({username: username}).exec();
    console.log(exists);
    if (exists) {
      return true;
    }
    return false;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, {password_hash: 0}).exec();
  }

  async collectConsole(username, collectedConsole: Collectable) {
    return this.userModel.updateOne({username: username}, {$push: {"owned_consoles": collectedConsole}})
  }

  async collectGame(username, collectedGame: Collectable) {
    return this.userModel.updateOne({username: username}, {$push: {"owned_games": collectedGame}})
  }

  async uncollectConsole(username, console: Collectable) {
    return this.userModel.updateOne({username: username}, {$pull: {"owned_consoles": console}})
  }

  async uncollectGame(username, game: Collectable) {
    return this.userModel.updateOne({username: username}, {$pull: {"owned_games": game}})
  }

  async deleteMany(username: string): Promise<any> {
    return this.userModel.deleteOne({username: username})
  }

  async editUser(username: string, userBody: CreateUserDto):  Promise<any> {
    return this.userModel.findOneAndUpdate({username: username}, userBody, {projection: {password_hash: 0}})
  }
}