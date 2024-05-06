import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from "supertest";
import { Neo4jModule } from '@nhogs/nestjs-neo4j';
import { ConsoleService } from '../console/console.service';
import { CompanyService } from '../company/company.service';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { GameService } from '../game/game.service';
import mongoose from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let app: INestApplication;
  let userService: UserService;
  let userId = "";

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(
      {
        imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
         MongooseModule.forRoot(process.env.MONGO_URI, {
          dbName: process.env.DB_NAME}
        ),
        Neo4jModule.forRoot({
          scheme: 'neo4j+s',
           port: 7687,
          username: process.env.NEO4J_USER,
          host: process.env.NEO4J_URI,
          password: process.env.NEO4J_PASSWORD,
          global: true
        })    
      ], 
      providers: [UserService]
      }
      ).compile();
  
      userService = module.get<UserService>(UserService);
  
    app = module.createNestApplication();
    await app.init();

    await userService.create({username: "TestUser", password_hash: "", admin: false, owned_consoles: [], owned_games: []})
  })

  afterAll(async () => {
    await userService.deleteMany("TestUser");
    return app.close();
    
  })

  it('/GET user', async () => {
    
  });

 /*  it('/POST game', async () => {
    const r =  await request(app.getHttpServer()).post('/game').send({"name": "TestGame", "developed_by": ["myGameCompany"], "released_on": ["myGameConsole"]}).expect(201);
    userId = r.body.id;
    return r;
  });

   

  it('/GET one game', async () => {
    const r =  await request(app.getHttpServer()).get(`/game/${gameId}`).expect(200);
    return r;
  });

  it('/PUT game', async () => {
    const r =  await request(app.getHttpServer()).put(`/game/${gameId}`).send({name: "TestedGame"}).expect(200)
    expect(r.body.name).toEqual("TestedGame");
    return r;
  });

  it('/DELETE game', async () => {
    const r =  await request(app.getHttpServer()).delete(`/game/${gameId}`).expect(200)
    return r;
  });  */

  
});
