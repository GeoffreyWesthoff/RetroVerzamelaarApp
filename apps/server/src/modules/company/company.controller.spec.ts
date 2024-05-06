import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyModule } from './company.module';
import { CompanyService } from './company.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from '../user/user.service';
import { INestApplication } from '@nestjs/common';
import * as request from "supertest";
import { Neo4jModule } from '@nhogs/nestjs-neo4j';

describe('CompanyController', () => {
  let controller: CompanyController;
  let app: INestApplication;
  let companyService: CompanyService
  let companyId = "";

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule(
      {
        imports: [CompanyModule,
          Neo4jModule.forRoot({
            scheme: 'neo4j+s',
             port: 7687,
            username: process.env.NEO4J_USER,
            host: process.env.NEO4J_URI,
            password: process.env.NEO4J_PASSWORD,
            global: true
          })
      ], 
      providers: [CompanyService]
      }
      ).compile();
  
      companyService = module.get<CompanyService>(CompanyService);
  
    let companyId = "";
  
    app = module.createNestApplication();
    await app.init();
  })

  it('/POST company', async () => {
    const r =  await request(app.getHttpServer()).post('/company').send({
      name: "TestCompany",
      establishment_year: "2000-01-01",
      annual_revenue: 5000000,
      image_url: "https://example.com",
      country: "USA"
  }).expect(201);
    companyId = r.body.id;
    return r;
  });

  it('/GET company', async () => {
    const r =  await request(app.getHttpServer()).get('/company').expect(200);
    return r;
  });

  it('/GET one company', async () => {
    const r =  await request(app.getHttpServer()).get(`/company/${companyId}`).expect(200);
    return r;
  });

  it('/PUT company', async () => {
    const r =  await request(app.getHttpServer()).put(`/company/${companyId}`).send({
    name: "TestedCompany",
    establishment_year: "2000-01-01",
    annual_revenue: 5000000,
    image_url: "https://example.com",
    country: "USA"
  }).expect(200);
    expect(r.body.name).toEqual("TestedCompany");
    return r;
  });

  it('/DELETE company', async () => {
    const r =  await request(app.getHttpServer()).delete(`/company/${companyId}`).expect(200)
    return r;
  });

  afterAll(done => {
    app.close();
    done();
  })


  
});
