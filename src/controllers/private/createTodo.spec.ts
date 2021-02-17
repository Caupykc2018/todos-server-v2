import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { createToken } from '../../utilities';
import { getRepository, Repository } from 'typeorm';
import { Todo } from '../../models';

describe('POST /api/todos', () => {
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

  test('create todo with valid data', async () => {
    const token = createToken(11);

    const response = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test_todo',
      });

    const todo = await todoRepository.findOne({ where: { userId: 11 } });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(todo.id);
  });

  test('empty title', async () => {
    const token = createToken(12);

    const response = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
      });

    const todo = await todoRepository.findOne({ userId: 12 });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('No title');
    expect(todo).toBeUndefined();
  });
});
