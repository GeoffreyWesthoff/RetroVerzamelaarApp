import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from "supertest";
import { Neo4jModule } from '@nhogs/nestjs-neo4j';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameModule } from './game.module';
import { ConsoleService } from '../console/console.service';
import { CompanyService } from '../company/company.service';

describe('GameController', () => {
  let controller: GameController;
  let app: INestApplication;
  let gameService: GameService;
  let consoleService: ConsoleService;
  let companyService: CompanyService;
  let gameId = "";

  afterAll(done => {
    app.close();
    done();
  })

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(
      {
        imports: [GameModule,
          Neo4jModule.forRoot({
            scheme: 'neo4j+s',
             port: 7687,
            username: process.env.NEO4J_USER,
            host: process.env.NEO4J_URI,
            password: process.env.NEO4J_PASSWORD,
            global: true
          })
      ], 
      providers: [GameService, ConsoleService, CompanyService]
      }
      ).compile();
  
      gameService = module.get<GameService>(GameService);
      companyService = module.get<CompanyService>(CompanyService);
      consoleService = module.get<ConsoleService>(ConsoleService);
  
    //await companyService.deleteOne("TestCompany");
    //@ts-ignore
    await companyService.create({"id": "myGameCompany", "image_url": "", "name": "GameCompany", "establishment_year": "2017-01-01", "country": "USA", "annual_revenue": 0})
    //@ts-ignore
    await consoleService.create({"id": "myGameConsole", "image_url": "", "name": "GameCompany", "release_date": "2017-01-01", "max_controllers": 1, "online_capable": true, "market_price": 19.99})

    app = module.createNestApplication();
    await app.init();
  })

  it('/POST game', async () => {
    const r =  await request(app.getHttpServer()).post('/game').send(
      {
        "name": "TestGame",
        "release_date": "2000-01-01",
        "market_price": 1.99,
        "image_url": "https://totallyanimage.com",
        "max_players": 1,
        "online_support": "false",
        "region": "NTSC",
        "rating": 5,
        "genre": "Action-Adventure",
        "developed_by": ["myGameCompany"],
        "released_on": ["myGameConsole"]
      }).expect(201);
    gameId = r.body.id;
    return r;
  });

   it('/GET game', async () => {
    const r =  await request(app.getHttpServer()).get('/game').expect(200);
    return r;
  });

  it('/GET one game', async () => {
    const r =  await request(app.getHttpServer()).get(`/game/${gameId}`).expect(200);
    return r;
  });

  it('/PUT game', async () => {
    const r =  await request(app.getHttpServer()).put(`/game/${gameId}`).send({
      "name": "TestedGame",
      "release_date": "2000-01-01",
      "market_price": 1.99,
      "image_url": "https://totallyanimage.com",
      "max_players": 1,
      "online_support": "false",
      "region": "NTSC",
      "rating": 5,
      "genre": "Action-Adventure",
      "developed_by": ["myGameCompany"],
      "released_on": ["myGameConsole"]
    }).expect(200)
    expect(r.body.name).toEqual("TestedGame");
    return r;
  });

  it('/DELETE game', async () => {
    const r =  await request(app.getHttpServer()).delete(`/game/${gameId}`).expect(200)
    return r;
  }); 

  
});
