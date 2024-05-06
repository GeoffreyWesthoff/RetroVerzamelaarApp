import {Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req} from '@nestjs/common';
import { UserService } from './user.service';
import "dotenv/config";
import { CollectBody } from '../game/dto/collect-body-dto';
import { ConsoleService } from '../console/console.service';
import { GameService } from '../game/game.service';
import * as crypto from "crypto";
import { CreateUserDto, DeleteSelfBody, EditUserAdminDto, EditUserDto, UserPartial } from './dto/create-user-dto';
import * as argon2 from "argon2";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
        private readonly gameService: GameService,
        private readonly consoleService: ConsoleService) {}
 

  @Get(':username')
  async get(@Param() username: UserPartial) {
    
    const user = await this.userService.findOne(username.username);

    if (!user) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }
    const consoles = await this.consoleService.findAll().run();
    const games = await this.gameService.findAll();
    const userConsoles = [];
    const userGames = [];

    for (let console of consoles) {
        
        if (user.owned_consoles.map((console) => (console.id)).includes(console.id)) {
            userConsoles.push(console);
        }
    }

    for (let game of games) {
        
        if (user.owned_games.map((game) => (game.id)).includes(game.id)) {
            userGames.push(game);
        }
    }

    const userRecs = await this.gameService.recommender(0, 10, user.owned_consoles.map((console) => (console.id)),
         user.owned_games.map((game) => (game.id)));

    return {user: user, consoles: userConsoles, games: userGames, recommendations: userRecs}

  }  

  @Get('')
  async getAllUser() {
    return await this.userService.findAll(); 
  }

  @Put('collect')
  async collect(@Req() req: Request, @Body() collectBody: CollectBody) {
    const objectId = collectBody.id;

    //@ts-ignore
    const token = req.token;
    const collectable = {nonce: crypto.randomBytes(64).toString('hex'), id: collectBody.id, region: collectBody.region, for_console: collectBody.for_console, condition: collectBody.condition, purchase_price: collectBody.purchase_price}

    if (!collectBody.id || !collectBody.region || !collectBody.condition || !collectBody.purchase_price) {
        throw new HttpException("Missing required fields", HttpStatus.BAD_REQUEST);
    }

    if (collectBody.type === 'console') {
        return await this.userService.collectConsole(token.username, collectable);
    } else if (collectBody.type === 'game') {
        if (!collectBody.for_console) {
            throw new HttpException("Game must be collected for a specific console!", HttpStatus.BAD_REQUEST)
        }
        return await this.userService.collectGame(token.username, collectable);

    }
  }

  @Put('uncollect')
  async uncollect(@Req() req: Request, @Body() collectBody: CollectBody) {
    const objectId = collectBody.id;

    //@ts-ignore
    const token = req.token;

    if (collectBody.type === 'console') {
        let collectable = {nonce: collectBody.nonce, id: collectBody.id, for_console: collectBody.for_console, condition: collectBody.condition, region: collectBody.region, purchase_price: collectBody.purchase_price}
        return await this.userService.uncollectConsole(token.username, collectable);
    } else if (collectBody.type === 'game') {
        let collectable = {nonce: collectBody.nonce, id: collectBody.id, for_console: collectBody.for_console, condition: collectBody.condition, region: collectBody.region, purchase_price: collectBody.purchase_price}

        return await this.userService.uncollectGame(token.username, collectable);

    }
  }

  @Delete('')
  async deleteSelf(@Req() req: Request, @Body() validation: DeleteSelfBody) {
    //@ts-ignore
    const token = req.token;

    if (!validation.current_password) {
        throw new HttpException('Your current password is neccesary', HttpStatus.UNAUTHORIZED)
    }

    const password = validation.current_password;

    const user = await this.userService.findUserWithHash(token.username);

    const check = await argon2.verify(user.password_hash, password);

    if (!check) {
        throw new HttpException('Your password was incorrect!', HttpStatus.FORBIDDEN);
    }

    return await this.userService.deleteMany(token.username);
  }

  @Put('')
  async editSelf(@Req() req: Request, @Body() userDto: EditUserDto) {
    //@ts-ignore
    const token = req.token;

    const current_password = userDto.current_password;

    const user = await this.userService.findUserWithHash(token.username);

    const check = await argon2.verify(user.password_hash, current_password);

    if (!check) {
        throw new HttpException('Your password was incorrect!', HttpStatus.FORBIDDEN);
    }

    const editedUser = {username: token.username, password_hash: user.password_hash, admin: user.admin, owned_games: user.owned_games, owned_consoles: user.owned_consoles};

    if (userDto.username !== token.username) {
        const checkUser = await this.userService.userExists(userDto.username);
        console.log(checkUser);
        if (checkUser) {
            throw new HttpException('This user already exists', HttpStatus.CONFLICT);
        } 
        editedUser.username = userDto.username;
    }

    if (current_password !== userDto.password && userDto.password) {
        if (userDto.password === userDto.password_confirm) {
            const hash = await argon2.hash(userDto.password);
            editedUser.password_hash = hash;
        }
    }

    

    return await this.userService.editUser(token.username, editedUser)
    
  }

  @Delete(':username')
  async deleteUserAdmin(@Param() username: UserPartial) {
    return await this.userService.deleteMany(username.username);
  }

  @Put(':username')
  async editUserAdmin(@Param() username: UserPartial, @Body() userDto: EditUserAdminDto) {

    const user = await this.userService.findUserWithHash(username.username);

    const editedUser = {username: userDto.username, password_hash: user.password_hash, admin: userDto.admin, owned_consoles: userDto.owned_consoles, owned_games: userDto.owned_games}

    if (userDto.password === userDto.password_confirm) {
        editedUser.password_hash = await argon2.hash(userDto.password)

    }

    await this.userService.editUser(username.username, editedUser);

    

  }
}

