import Router from "koa-router";
import jwt from "jsonwebtoken";
import {RefreshToken, User} from "../models";
import bcrypt from "bcryptjs";

import config from "../config";

export const publicRoutes = () => {
  const authRouter = new Router();

  authRouter.post('/login', async ctx => {
    const {login, password} = ctx.request.body;

    try {
      const user = await User.findOne({login: login});

      if(!user) {
        ctx.response.status = 404;
        return ctx.response.body = {
          message: "Incorrect login or password"
        }
      }

      if(!user.isActive) {
        ctx.response.status = 403;
        return ctx.response.body = {
          message: "Access denied"
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        ctx.response.status = 404;
        return ctx.response.body = {
          message: "Incorrect login or password"
        }
      }

      await RefreshToken.deleteOne({userId: user._id});

      const refreshToken = await RefreshToken.create({
        value: await bcrypt.hash(user._id + new Date().getTime(), 8),
        userId: user._id
      });

      const token = jwt.sign({id: user._id}, config.secretToken, {expiresIn: 60});

      ctx.response.status = 200
      return ctx.response.body = {
        token: `Bearer ${token}`,
        refreshToken: refreshToken.value,
        login: user.login
      };
    }
    catch(e) {
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      };
    }
  });

  authRouter.post('/register', async ctx => {
    const {login, password} = ctx.request.body;

    try {
      const hashPassword = await bcrypt.hash(password, 8);

      const user = await User.create({login: login, password: hashPassword});

      const refreshToken = await RefreshToken.create({
        value: await bcrypt.hash(user._id + new Date().getTime(), 8),
        userId: user._id
      });

      const token = jwt.sign({id: user._id}, config.secretToken, {expiresIn: 60});

      ctx.response.status = 200;
      return ctx.response.body = {
        token: `Bearer ${token}`,
        refreshToken: refreshToken.value,
        login: user.login
      };
    }
    catch(e) {
      ctx.response.status = 400;
      return ctx.response.body = {
        message: "Login is not unique"
      }
    }
  });

  authRouter.post('/refresh-token', async ctx => {
    const {refreshToken} = ctx.request.body;

    try {
      const oldRefreshToken = await RefreshToken.findOneAndDelete({value: refreshToken});

      if(!oldRefreshToken) {
        ctx.response.status = 401;
        return ctx.response.body = {
          message: "Incorrect refresh token"
        }
      }

      const newRefreshToken = await RefreshToken.create({
        value: await bcrypt.hash(user._id + new Date().getTime(), 8),
        userId: user._id
      });

      const token = jwt.sign({id: newRefreshToken.userId}, config.secretToken, {expiresIn: 60});

      return ctx.response.body = {
        token: `Bearer ${token}`,
        refreshToken: newRefreshToken.value
      };
    }
    catch (e) {
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      };
    }
  });

  return [authRouter.routes()];
}
