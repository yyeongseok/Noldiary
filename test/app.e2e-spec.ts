import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('hello jest', () => {
    it('two plus two is four', () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe('/users', () => {
    it('/users (GET)', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.statusCode).toBe(401);
    });
  });
});
