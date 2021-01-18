import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import {connection, Todo, User} from "./models";

import {publicRoutes} from "./routes/public";
import {privateRoutes} from "./routes/private";

const bootstrap = async fn => {
  await connection();

  const app = new Koa();

  const rootRouter = new Router({
    prefix: "/api"
  });

  app.use(bodyParser());

  app.use(async(ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.set('Access-Control-Allow-Headers', 'Content-type, Authorization');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Credentials', 'true')
    if(ctx.request.method === "OPTIONS") {
      ctx.response.status = 204;
    }
    else await next()
  });

  rootRouter.use(...publicRoutes());
  rootRouter.use(...privateRoutes());

  app.use(rootRouter.routes());
  app.use(rootRouter.allowedMethods());

  return app;
}

export const startup = async () => {
  const app = await bootstrap();

  app.listen(3001, () => console.log("Server start"));
}

