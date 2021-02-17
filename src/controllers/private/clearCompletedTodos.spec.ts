import * as request from 'supertest';
import { Server } from 'http';
import { getRepository, Repository } from 'typeorm';
import { createToken } from '../../utilities';
import { bootstrap } from '../../server';
import { Todo } from '../../models';

describe('POST /api/todos/clear-completed', () => {
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

  test('delete completed todos', async () => {
    const todos = await todoRepository.find({
      where: { userId: 17, isCompleted: true },
    });

    const token = createToken(17);

    const response = await request(app)
      .post('/api/todos/clear-completed')
      .set('Authorization', `Bearer ${token}`);

    const updatedTodos = await todoRepository.find({
      where: { userId: 17, isCompleted: true },
    });

    expect(response.status).toBe(200);
    expect(updatedTodos).toEqual([]);
  });
});
