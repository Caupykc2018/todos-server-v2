import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { RefreshToken } from '../../models';

describe('POST /api/refresh-token', () => {
  let app: Server;
  let refreshTokenRepository: MongoRepository<RefreshToken>;

  beforeAll(async () => {
    app = (await bootstrap()).listen();
    refreshTokenRepository = getMongoRepository(RefreshToken, 'mongo');
  });

  afterAll(async (done) => {
    app.close();
    done();
  });

  test('simple test', async () => {
    const refreshToken = await refreshTokenRepository.findOne({
      userId: 5,
    });

    const response = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken: refreshToken.value });

    expect(response.body.refreshToken).not.toBe(refreshToken.value);
    expect(response.body.id).toBe(refreshToken.userId);
  });

  test('not exist refresh token', async () => {
    const response = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken: 'incorrect token' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not found this token');
  });

  test('banned user', async () => {
    const refreshToken = await refreshTokenRepository.findOne({
      userId: 6,
    });

    const response = await request(app)
      .post('/api/refresh-token')
      .send({ refreshToken: refreshToken.value });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied');
  });
});
