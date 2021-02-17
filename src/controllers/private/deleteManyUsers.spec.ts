import { createToken } from '../../utilities';
import * as request from 'supertest';
import { getRepository, In, Repository } from 'typeorm'
import { User } from '../../models'
import { Server } from 'http';
import { bootstrap } from '../../server';

describe('DELETE /api/users', () => {
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

  test('delete users with valid params', async () => {
    const token = createToken(18);

    const response = await request(app)
      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userIds: [23, 24, 25]
      })

    const users = await userRepository.find({id: In([23, 24, 25])});
    expect(response.status).toBe(200);
    expect(users).toEqual([]);
  });
});
