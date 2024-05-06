import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put} from '@nestjs/common';
import { ConsoleService } from './console.service';
import { Console } from '../../schemas/console.schema';
import {CreateConsoleDto} from "./dto/create-console-dto";
import * as crypto from "crypto";
import { Game } from 'src/schemas/game.schema';
import { Cons } from 'rxjs';

function isNoneType(x: any) {
  return x === undefined || x === null;
}

@Controller('console')
export class ConsoleController {
  constructor(private readonly consoleService: ConsoleService) {}

  @Post()
  async create(@Body() createConsoleDto: CreateConsoleDto): Promise<Console> {
    createConsoleDto.id = crypto.randomBytes(64).toString('hex');

    if (isNoneType(createConsoleDto.name) || isNoneType(createConsoleDto.image_url) || isNoneType(createConsoleDto.market_price) || isNoneType(createConsoleDto.max_controllers) || isNoneType(createConsoleDto.online_capable) || isNoneType(createConsoleDto.release_date)) {
      throw new HttpException("Missing required fields", HttpStatus.BAD_REQUEST)
    }

    if (isNaN(createConsoleDto.market_price) || isNaN(createConsoleDto.max_controllers)) {
      throw new HttpException("max_controllers or market_price is not a number", HttpStatus.BAD_REQUEST)
    }

    return await this.consoleService.create(createConsoleDto).run();
  }

  @Get()
  async findAll(): Promise<Console[]> {
    return await this.consoleService.findAll().run();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Console> {
    const consoles = await this.consoleService.findBy({id: id}).run();
    return consoles[0];
  }

  @Get(':id/best')
  async getBest(@Param('id') id: string): Promise<Game[]> {
    return this.consoleService.getBest(id);
  }

  @Post('search')
  async search(@Body() body: any) {
    return await this.consoleService.search(body.input);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Console[]> {
    return await this.consoleService.delete({id: id}).run()
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedConsole: CreateConsoleDto): Promise<Console> {
    updatedConsole.id = id;

    if (isNoneType(updatedConsole.name) || isNoneType(updatedConsole.image_url) || isNoneType(updatedConsole.market_price) || isNoneType(updatedConsole.max_controllers) || isNoneType(updatedConsole.online_capable) || isNoneType(updatedConsole.release_date)) {
      throw new HttpException("Missing required fields", HttpStatus.BAD_REQUEST)
    }

    if (isNaN(updatedConsole.market_price) || isNaN(updatedConsole.max_controllers)) {
      throw new HttpException("max_controllers or market_price is not a number", HttpStatus.BAD_REQUEST)
    }

    const consoles = await this.consoleService.update({id: id}, this.consoleService.toNeo4j(updatedConsole), {mutate: true, returns: true}).run();
    return consoles[0];
  }
}
