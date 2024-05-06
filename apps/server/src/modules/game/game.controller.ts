import { Body, Controller, Get, Param, Post, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game-dto';
import * as crypto from "crypto";
import { Game } from 'src/schemas/game.schema';

function isNoneType(x: any) {
  return x === undefined || x === null;
}

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() body: any) {
    const createGameDto = new CreateGameDto(body);
    createGameDto.id = crypto.randomBytes(64).toString('hex');

    if (isNoneType(createGameDto.name) || isNoneType(createGameDto.genre) || isNoneType(createGameDto.release_date) || isNoneType(createGameDto.market_price) || isNoneType(createGameDto.rating) || isNoneType(createGameDto.image_url) || isNoneType(createGameDto.max_players) || isNoneType(createGameDto.online_support) || isNoneType(createGameDto.region)) {
      throw new HttpException("Required fields are missing", HttpStatus.BAD_REQUEST);
    }

    if (isNaN(createGameDto.market_price) || isNaN(createGameDto.max_players) || isNaN(createGameDto.rating)) {
      throw new HttpException("market_price, rating and max_players must be numbers", HttpStatus.BAD_REQUEST);
    }
    

    const released_on = body.released_on;
    const developed_by = body.developed_by;

    if (released_on.length === 0 || developed_by.length === 0) {
      throw new HttpException('A game must have at least one developed_by and at least one released_on', HttpStatus.BAD_REQUEST);
    } 

    const game = await this.gameService.create(createGameDto, released_on, developed_by);
    return game;
  }

  @Get()
  async get() {
    return await this.gameService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.gameService.findOne(id);
  }

  @Post('search')
  async search(@Body() body: any) {
    return await this.gameService.search(body.input);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.gameService.deleteOne(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedGame: any): Promise<Game> {
      updatedGame.id = id;

      if (isNoneType(updatedGame.name) || isNoneType(updatedGame.genre) || isNoneType(updatedGame.release_date) || isNoneType(updatedGame.market_price) || isNoneType(updatedGame.rating) || isNoneType(updatedGame.image_url) || isNoneType(updatedGame.max_players) || isNoneType(updatedGame.online_support) || isNoneType(updatedGame.region)) {
        throw new HttpException("Required fields are missing", HttpStatus.BAD_REQUEST);
      }
  
      if (isNaN(updatedGame.market_price) || isNaN(updatedGame.max_players) || isNaN(updatedGame.rating)) {
        throw new HttpException("market_price, rating and max_players must be numbers", HttpStatus.BAD_REQUEST);
      }

      if (updatedGame.released_on.length === 0 || updatedGame.developed_by.length === 0) {
        throw new HttpException('A game must have at least one developed_by and at least one released_on', HttpStatus.BAD_REQUEST);
      } 
  

      return await this.gameService.updateOne(id, updatedGame, updatedGame.released_on, updatedGame.developed_by);
  }
}
