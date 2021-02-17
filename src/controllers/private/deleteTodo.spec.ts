import { createToken } from '../../utilities';
import * as request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { Todo } from '../../models';
import { Server } from 'http';
import { bootstrap } from '../../server';

describe('DELETE /api/todos/:todoId', () => {
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

  test('delete todo with valid params', async () => {
    const token = createToken(14);

    const response = await request(app)
      .delete('/api/todos/10')
      .set('Authorization', `Bearer ${token}`);

    const todo = await todoRepository.findOne(10);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(10);
    expect(todo).toBeUndefined();
  });

  test('foreign user delete todo', async () => {
    const token = createToken(13);

    const response = await request(app)
      .delete('/api/todos/11')
      .set('Authorization', `Bearer ${token}`);

    const todo = await todoRepository.findOne(11);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'You have not access for delete this todo'
    );
    expect(todo).not.toBeUndefined();
  });
});
