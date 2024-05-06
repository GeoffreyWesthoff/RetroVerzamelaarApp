import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from '../../schemas/user.schema';
import { UserService } from '../user/user.service';
import { AuthModule } from './auth.module';
import "dotenv/config";
import { UserModule } from '../user/user.module';
import { Neo4jModule } from '@nhogs/nestjs-neo4j';

describe('AuthController', () => {
  let app: INestApplication;
  let userService: UserService;
  
beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule(
    {
      imports: [AuthModule,
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      MongooseModule.forRoot(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME
      })
    ], 
    providers: [UserService]
    }
    ).compile();

    userService = module.get<UserService>(UserService);

  await userService.deleteMany("TestUser");

  app = module.createNestApplication();
  await app.init();
})


  it('/POST signup correctly', async () => {
    return await request(app.getHttpServer()).post('/signup').send({username: 'TestUser', password: 'TestUserPass', password_confirm: 'TestUserPass'}).expect(201)
  });

  it ('/POST login', async () => {
    return await request(app.getHttpServer()).post('/login').send({username: 'TestUser', password: 'TestUserPass'}).expect(200)
  })

  it('/POST signup with short password', async () => {
    return await request(app.getHttpServer()).post('/signup').send({username: 'ShortUser', password: 'Short', password_confirm: 'Short'}).expect(400)
  });

  it('/POST signup with nonmatching password and confirm', async () => {
    return await request(app.getHttpServer()).post('/signup').send({username: 'NonMatchPassword', password: 'ThisPassword', password_confirm: 'DoesNotMatch'}).expect(400)
  });

  it('/POST signup with values missing', async () => {
    return await request(app.getHttpServer()).post('/signup').send({password: 'ThisPassword'}).expect(400)
  });

  it('/POST signup with already inserted user missing', async () => {
    return await request(app.getHttpServer()).post('/signup').send({username: 'TestUser', password: 'TestUserPass', password_confirm: 'TestUserPass'}).expect(409)
  });

  afterAll(async () => {
    await userService.deleteMany('TestUser');
    app.close();
    
  })

});
