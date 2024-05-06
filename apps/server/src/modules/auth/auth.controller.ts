import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto, SignUpBody } from '../user/dto/create-user-dto';
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

@Controller('')
export class AuthController {

constructor(private readonly userService: UserService) {}

@Post('login')
@HttpCode(200)
async login(@Body() loginBody: SignUpBody) {
    const user = await this.userService.findUserWithHash(loginBody.username);

    if (!loginBody.username || !loginBody.password) {
        throw new HttpException('Login Failed', HttpStatus.BAD_REQUEST);
    }

    if (!user) {
        throw new HttpException('Login Failed', HttpStatus.BAD_REQUEST);
    }

    const check = await argon2.verify(user.password_hash, loginBody.password);

    if (!check) {
        throw new HttpException('Login Failed', HttpStatus.BAD_REQUEST)
    }
    
    return {token: jwt.sign({"username": user.username, "admin": user.admin}, process.env.JWT_SECRET || "BLABLABLA")};


    }

    @Post('signup')
    @HttpCode(201)
    async signup(@Body() signupBody: SignUpBody) {

        const userExists = await this.userService.findOne(signupBody.username)

        if (userExists) {
            throw new HttpException('Your account could not be created as a user with this username already exists!', HttpStatus.CONFLICT);
        }

        if (!signupBody.password  || !signupBody.username || !signupBody.password_confirm) {
            throw new HttpException('Missing required values', HttpStatus.BAD_REQUEST);
        }

        if (signupBody.password !== signupBody.password_confirm) {
            throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
        }

        if (signupBody.password.length < 8 || signupBody.password.length > 64) {
            throw new HttpException('Passwords must be between 8 and 64 characters', HttpStatus.BAD_REQUEST)
        }

        const hash = await argon2.hash(signupBody.password);

        const userDto = new CreateUserDto(signupBody.username, hash)

        await this.userService.create(userDto);

        return
  }

}
