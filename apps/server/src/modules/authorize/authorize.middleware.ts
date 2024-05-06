import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthorizeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    const date = Date.now() / 1000
    console.log(date)

    if (req.headers.authorization === undefined) {
      throw new HttpException('NO HEADER', HttpStatus.UNAUTHORIZED);
    }

    const token = req.headers.authorization.split(' ')[1];
    try { 
      const check = jwt.verify(token, process.env.JWT_SECRET); 
      if (!check) {
        throw new HttpException('CHECK FAILED', HttpStatus.UNAUTHORIZED);
      }
     } catch (e) {
      throw new HttpException('CAUGHT', HttpStatus.UNAUTHORIZED);
    };
    
    
    const decoded = jwt.decode(token);

    
    if (decoded['iat'] + 86400 < date) {
      throw new HttpException('EXPIRED', HttpStatus.FORBIDDEN);
    }

    req.token = decoded;
    next();
  }
}
