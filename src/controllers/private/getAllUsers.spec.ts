import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { createToken } from '../../utilities';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../models';

describe('GET /api/users', () => {
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
    const token = createToken(18);

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    const users = await userRepository.find();

    expect(response.status).toBe(200);
    users.forEach((user, index) =>
      expect(response.body[index]).toEqual({
        id: users[index].id,
        login: users[index].login,
        isActive: users[index].isActive,
        role: users[index].role,
      })
    );
  });

  describe('auth test', () => {
    test('user is not admin', async () => {
      const token = createToken(19);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You have not permission');
    });
  });
});
