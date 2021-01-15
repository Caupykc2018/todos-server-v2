import Router from "koa-router";
import jwt from "jsonwebtoken";
import {User} from "../models";

export const publicRoutes = () => {
  const authRouter = new Router();

  authRouter.post('/login', async ctx => {
    const {login, password} = ctx.request.body;

    try {
      const user = await User.findOne({login: login, password: password});

      if(!user) {
        ctx.response.status = 404;
        return ctx.response.body = {
          message: "Incorrect login or password"
        }
      }

      const token = jwt.sign({id: user._id}, "secret");

      ctx.response.status = 200
      return ctx.response.body = {
        token: `Bearer ${token}`,
        login: user.login
      };
    }
    catch(e) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: e.message
      }
    }
  });

  authRouter.post('/register', async ctx => {
    const {login, password} = ctx.request.body;

    try {
      const user = await User.create({login: login, password: password});

      const token = jwt.sign({id: user._id}, "secret");

      ctx.body = {
        token: `Bearer ${token}`,
        login: user.login
      };
    }
    catch(e) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Login is not unique"
      }
    }
  });

  return [authRouter.routes()];
}
