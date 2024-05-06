import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from "supertest";
import { Neo4jModule } from '@nhogs/nestjs-neo4j';
import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';
import { ConsoleModule } from './console.module';

describe('ConsoleController', () => {
  let controller: ConsoleController;
  let app: INestApplication;
  let consoleService: ConsoleService
  let consoleId = "";
  afterAll(done => {
    app.close();
    done();
  })
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(
      {
        imports: [ConsoleModule,
          Neo4jModule.forRoot({
            scheme: 'neo4j+s',
             port: 7687,
            username: process.env.NEO4J_USER,
            host: process.env.NEO4J_URI,
            password: process.env.NEO4J_PASSWORD,
            global: true
          })
      ], 
      providers: [ConsoleService]
      }
      ).compile();
  
      consoleService = module.get<ConsoleService>(ConsoleService);
  
    //await companyService.deleteOne("TestCompany");
  
    app = module.createNestApplication();
    await app.init();
  })

  it('/POST console', async () => {
    const r =  await request(app.getHttpServer()).post('/console').send({
      "name": "TestConsole",
      "release_date": "2000-01-01",
      "market_price": 19.99,
      "image_url": "https://example.com",
      "max_controllers": 2,
      "online_capable": "true"
    }).expect(201);
    consoleId = r.body.id;
    return r;
  });

  it('/GET console', async () => {
    const r =  await request(app.getHttpServer()).get('/console').expect(200);
    return r;
  });

  it('/GET one console', async () => {
    const r =  await request(app.getHttpServer()).get(`/console/${consoleId}`).expect(200);
    return r;
  });

  it('/PUT console', async () => {
    const r =  await request(app.getHttpServer()).put(`/console/${consoleId}`).send({name: "TestedConsole","release_date": "2000-01-01",
    "market_price": 19.99,
    "image_url": "https://example.com",
    "max_controllers": 2,
    "online_capable": "true"}).expect(200)
    expect(r.body.name).toEqual("TestedConsole");
    return r;
  });

  it('/DELETE console', async () => {
    const r =  await request(app.getHttpServer()).delete(`/console/${consoleId}`).expect(200)
    return r;
  });

  
});
