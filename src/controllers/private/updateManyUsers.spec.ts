import { bootstrap } from '../../server';
import * as request from 'supertest';
import { Server } from 'http';
import { createToken } from '../../utilities';
import { getRepository, In, Repository } from 'typeorm';
import { User } from '../../models';

describe('PUT /api/users', () => {
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
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userIds: [26, 27, 28],
          role: 'admin',
        });

      const users = await userRepository.find({ id: In([26, 27, 28]) });
      console.log(users);

      expect(response.status).toBe(200);
      response.body.forEach((user) => {
        expect(user.role).toBe('admin');
      });
      users.forEach((user) => {
        expect(user.role).toBe('admin');
      });
    });

    test('change status', async () => {
      const token = createToken(18);

      const response = await request(app)
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userIds: [29, 30, 31],
          isActive: false,
        });

      const users = await userRepository.find({ id: In([29, 30, 31]) });
      console.log(users);

      expect(response.status).toBe(200);
      response.body.forEach((user) => {
        expect(user.isActive).toBe(false);
      });
      users.forEach((user) => {
        expect(user.isActive).toBe(false);
      });
    });
  });
});
