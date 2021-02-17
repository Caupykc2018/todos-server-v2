import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { createToken } from '../../utilities';
import { getRepository, Repository } from 'typeorm';
import { Todo } from '../../models';

describe('GET /api/todos', () => {
  let app: Server;
  let todoRepository: Repository<Todo>;

  beforeAll(async () => {
    app = (await bootstrap()).listen();
    todoRepository = getRepository(Todo, 'maria');
  });

  afterAll(async (done) => {
    app.close();
    done();
  });

  test('get all user`s todos with valid data', async () => {
    const token = createToken(7);

    const response = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    const todos = await todoRepository.find({ userId: 7 });

    expect(response.status).toBe(200);
  });

  test('get all user`s todos with filters', async () => {
    const token = createToken(7);

    const response = await request(app)
      .get(`/api/todos?start=${new Date(2001, 11).getTime().toString()}&end=${new Date().getTime().toString()}`)
      .set('Authorization', `Bearer ${token}`);

    console.log(response.body);

    expect(response.status).toBe(200);
  });

  describe('auth test', () => {
    test('incorrect token', async () => {
      const token = 'incorrect_token';

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authorized error');
    });

    test('not exist user', async () => {
      const token = createToken(1000000);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authorized error');
    });

    test('expired token', async () => {
      const token = createToken(7, 0);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authorized error');
    });
  });
});
