import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';

import { connection } from './models/connection';

import { publicRoutes } from './routes/public';
import { privateRoutes } from './routes/private';
import { IContext } from './interfaces';
import { getCustomRepository } from 'typeorm';
import {
  RefreshTokenRepository,
  TodoRepository,
  UserRepository,
} from './repositories';
import { createServer } from 'http';
import { createSocket } from './socket';

export const bootstrap = async () => {
  await connection();

  const app = new Koa();

  const rootRouter: Router = new Router({
    prefix: '/api',
  });

  app.use(async (ctx: IContext, next) => {
    ctx.userRepository = getCustomRepository(UserRepository, 'maria');
    ctx.todoRepository = getCustomRepository(TodoRepository, 'maria');
    ctx.refreshTokenRepository = getCustomRepository(
      RefreshTokenRepository,
      'mongo'
    );

    await next();
  });

  app.use(bodyParser());

  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.set(
      'Access-Control-Allow-Headers',
      'Content-type, Authorization, SocketId'
    );
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    if (ctx.request.method === 'OPTIONS') {
      ctx.response.status = 204;
    } else await next();
  });

  const server = createServer(app.callback());
  const io = createSocket(server);

  app.use(async (ctx, next) => {
    ctx.io = io;
    await next();
  });

  rootRouter.use(...publicRoutes());
  rootRouter.use(...privateRoutes());

  app.use(rootRouter.routes());
  app.use(rootRouter.allowedMethods());

  return server;
};

export const startup = async () => {
  const app = await bootstrap();

  app.listen(3001, () => console.log('Server start'));
};
