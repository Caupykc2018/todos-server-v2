import * as Router from 'koa-router';

import { logIn } from '../controllers/public/logIn';
import { register } from '../controllers/public/register';
import { refreshingToken } from '../controllers/public/refreshingToken';
import { createAdmin } from '../controllers/public/createAdmin';

export const publicRoutes = () => {
  const authRouter = new Router();

  const testRouter = new Router({
    prefix: '/test',
  });

  authRouter.post('/logIn', logIn);
  authRouter.post('/register', register);
  authRouter.post('/refresh-token', refreshingToken);

  testRouter.post('/create-admin', createAdmin);

  return [authRouter.routes(), testRouter.routes()];
};
