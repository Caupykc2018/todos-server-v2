import * as request from 'supertest';
import { Server } from 'http';
import { getRepository, Repository } from 'typeorm';
import { bootstrap } from '../../server';
import { User } from '../../models';

describe('POST /api/register', () => {
  let app: Server;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    app = (await bootstrap()).listen();
    userRepository = getRepository(User, 'maria');
  });

  afterAll(async (done) => {
    app.close();
    done();
  });

  test('simple test', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ login: 'user', password: 'qwerty789' });

    const user = await userRepository.findOne({ login: 'user' });

    expect(user).not.toBeUndefined();
    expect(response.body.login).toEqual(user.login);
  });

  test('duplicate logIn', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ login: 'user4', password: 'qwerty789' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Login is not unique');
  });

  test('empty logIn', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ login: '', password: 'qwerty789' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Not all fields filled');
  });

  test('empty password', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ login: 'us', password: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Not all fields filled');
  });
});
