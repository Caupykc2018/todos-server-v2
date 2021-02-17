import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { createToken } from '../../utilities';
import { getRepository, Repository } from 'typeorm';
import { Todo } from '../../models';

describe('PUT /api/todos/:todoId', () => {
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
    test('change title', async () => {
      const token = createToken(13);

      const response = await request(app)
        .put('/api/todos/6')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'change_title_todo',
        });

      const todo = await todoRepository.findOne(6);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(todo.title);
      expect(todo.title).toBe('change_title_todo');
    });

    test('change isCompleted', async () => {
      const token = createToken(13);

      const response = await request(app)
        .put('/api/todos/7')
        .set('Authorization', `Bearer ${token}`)
        .send({
          isCompleted: true,
        });

      const todo = await todoRepository.findOne(7);

      expect(response.status).toBe(200);
      expect(response.body.isCompleted).toBe(todo.isCompleted);
      expect(todo.isCompleted).toBe(true);
    });
  });

  test('empty title', async () => {
    const token = createToken(13);

    const response = await request(app)
      .put('/api/todos/8')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
      });

    const todo = await todoRepository.findOne(8);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Title can not be empty');
    expect(todo.title).not.toBe('');
  });

  test('foreign user edit todo', async () => {
    const token = createToken(12);

    const response = await request(app)
      .put('/api/todos/9')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'change_title_todo',
      });

    const todo = await todoRepository.findOne(9);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'You have not access for edit this todo'
    );
    expect(todo.title).not.toBe('change_title_todo');
  });
});
