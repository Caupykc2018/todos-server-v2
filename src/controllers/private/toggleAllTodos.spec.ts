import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { createToken } from '../../utilities';
import { getRepository, Repository } from 'typeorm';
import { Todo } from '../../models';

describe('POST /api/todos/toggle-all', () => {
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

  describe('simple tests', () => {
    test('all todos completed', async () => {
      const token = createToken(15);

      const response = await request(app)
        .post('/api/todos/toggle-all')
        .set('Authorization', `Bearer ${token}`);

      const todos = await todoRepository.find({ userId: 15 });

      expect(response.status).toBe(200);
      todos.forEach((todo) => expect(todo.isCompleted).toEqual(false));
    });

    test('contain not completed todos', async () => {
      const todos = await todoRepository.find({
        userId: 16,
        isCompleted: false,
      });

      const token = createToken(16);

      const response = await request(app)
        .post('/api/todos/toggle-all')
        .set('Authorization', `Bearer ${token}`);

      const updatedTodos = await todoRepository.find({
        userId: 16,
        isCompleted: false,
      });

      expect(response.status).toBe(200);
      todos.forEach((todo) => (todo.isCompleted = true));
      expect(updatedTodos).toEqual([]);
    });
  });
});
