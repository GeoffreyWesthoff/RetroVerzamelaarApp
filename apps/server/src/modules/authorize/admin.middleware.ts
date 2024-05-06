import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from "jsonwebtoken";

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  
  use(req: any, res: any, next: () => void) {
    if (req.headers.authorization === undefined) {
      throw new HttpException('NO HEADER', HttpStatus.UNAUTHORIZED);
    }

    const token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.decode(token);

    if (token === undefined) {
      throw new HttpException('NO TOKEN', HttpStatus.UNAUTHORIZED)
    }
    //@ts-ignore
    if (decoded.admin == false) {
      throw new HttpException('NOT ADMIN', HttpStatus.FORBIDDEN)
    }

    next();
  }
}
