import * as request from 'supertest';
import { Server } from 'http';
import { bootstrap } from '../../server';

describe('POST /api/logIn', () => {
  let app: Server;

  beforeAll(async () => {
    app = (await bootstrap()).listen();
  });

  afterAll(async (done) => {
    app.close();
    done();
  });

  test('simple test', async () => {
    const response = await request(app)
      .post('/api/logIn')
      .send({ login: 'user1', password: 'qwerty789' });

    expect(response.body.login).toBe('user1');
  });

  test('not exist logIn', async () => {
    const response = await request(app)
      .post('/api/logIn')
      .send({ login: 'u', password: 'qwerty789' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Incorrect logIn or password');
  });

  test('incorrect user password', async () => {
    const response = await request(app)
      .post('/api/logIn')
      .send({ login: 'user2', password: 'qwerty' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Incorrect logIn or password');
  });

  test('banned user', async () => {
    const response = await request(app)
      .post('/api/logIn')
      .send({ login: 'user3', password: 'qwerty789' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied');
  });
});
