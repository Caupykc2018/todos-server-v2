import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { createToken } from '../../utilities';
import { getRepository, Repository } from 'typeorm';
import { User } from '../../models';

describe('PUT /api/users/:userId', () => {
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

  describe('simple tests', () => {
    test('change role', async () => {
      const token = createToken(18);

      const response = await request(app)
        .put('/api/users/20')
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'admin',
        });

      const user = await userRepository.findOne(20);

      expect(response.status).toBe(200);
      expect(response.body.role).toBe('admin');
      expect(user.role).toBe('admin');
    });

    test('change status', async () => {
      const token = createToken(18);

      const response = await request(app)
        .put('/api/users/21')
        .set('Authorization', `Bearer ${token}`)
        .send({
          isActive: false,
        });

      const user = await userRepository.findOne(21);

      expect(response.status).toBe(200);
      expect(response.body.isActive).toBe(false);
      expect(user.isActive).toBe(false);
    });
  });
});
