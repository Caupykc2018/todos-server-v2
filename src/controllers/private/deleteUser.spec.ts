import { createToken } from '../../utilities';
import * as request from 'supertest';
import {
  getMongoRepository,
  getRepository,
  MongoRepository,
  Repository,
} from 'typeorm';
import { RefreshToken, Todo, User } from '../../models';
import { Server } from 'http';
import { bootstrap } from '../../server';

describe('DELETE /api/users/:userId', () => {
  let app: Server;
  let userRepository: Repository<User>;
  let todoRepository: Repository<Todo>;
  let refreshTokenRepository: MongoRepository<RefreshToken>;

  beforeAll(async () => {
    app = (await bootstrap()).listen();
    userRepository = getRepository(User, 'maria');
    todoRepository = getRepository(Todo, 'maria');
    refreshTokenRepository = getMongoRepository(RefreshToken, 'mongo');
  });

  afterAll(async (done) => {
    app.close();
    done();
  });

  test('delete user with valid params', async () => {
    const token = createToken(18);

    const response = await request(app)
      .delete('/api/users/22')
      .set('Authorization', `Bearer ${token}`);

    const user = await userRepository.findOne(22);
    const todos = await todoRepository.find({ userId: 22 });
    const refreshToken = await refreshTokenRepository.findOne({ userId: 22 });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(22);
    expect(user).toBeUndefined();
    expect(todos).toEqual([]);
    expect(refreshToken).toBeUndefined();
  });
});
