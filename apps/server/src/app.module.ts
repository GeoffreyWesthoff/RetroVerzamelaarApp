import { MiddlewareConsumer, Module, Req, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from './modules/console/console.module';
import { UserModule } from './modules/user/user.module';
import 'dotenv/config';
import { AuthorizeMiddleware } from './modules/authorize/authorize.middleware';
import { Neo4jModule } from '@nhogs/nestjs-neo4j';
import { GameService } from './modules/game/game.service';
import { GameModule } from './modules/game/game.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { AdminMiddleware } from './modules/authorize/admin.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    }),
    Neo4jModule.forRoot({
      scheme: 'neo4j+s',
      port: 7687,
      host: process.env.NEO4J_URI,
      username: process.env.NEO4J_USER,
      password: process.env.NEO4J_PASS,
      global: true,
    }),
    ConsoleModule,
    UserModule,
    GameModule,
    AuthModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizeMiddleware).forRoutes('user');
    consumer.apply(AdminMiddleware).exclude(
      {path: 'console', method: RequestMethod.GET},
      {path: 'company', method: RequestMethod.GET},
      {path: 'game', method: RequestMethod.GET},
      {path: 'console/(.*)', method: RequestMethod.GET},
      {path: 'company/(.*)', method: RequestMethod.GET},
      {path: 'game/(.*)', method: RequestMethod.GET},
      {path: 'game/search', method: RequestMethod.POST},
      {path: 'console/search', method: RequestMethod.POST},
      {path: 'company/search', method: RequestMethod.POST},
      'user/collect', 'user/uncollect',
      {path: '/user', method: RequestMethod.PUT},
      {path: '/user', method: RequestMethod.DELETE},
      {path: 'user/(.*)', method: RequestMethod.GET})
    .forRoutes('console', 'company', 'game', 'user')
  }
}
