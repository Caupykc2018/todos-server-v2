import Router from "koa-router";
import jwt from "jsonwebtoken";
import {RefreshToken, User} from "../models";
import bcrypt from "bcryptjs";

import config from "../config";

const createToken = (userId, role) => jwt.sign({id: userId, role: role}, config.secretToken, {expiresIn: 60});

const createRefreshToken = async (userId) => await bcrypt.hash(userId + new Date().getTime(), 8);

const hashPassword = async (password) => await bcrypt.hash(password, 8);

export const publicRoutes = () => {
  const authRouter = new Router();

  const testRouter = new Router({
    prefix: "/test"
  });

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

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
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

      await RefreshToken.deleteOne({userId: user._id});

      const refreshToken = await RefreshToken.create({
        value: await createRefreshToken(user._id),
        userId: user._id
      });

      const token = createToken(user._id, user.role);

      ctx.response.status = 200
      return ctx.response.body = {
        token: `Bearer ${token}`,
        refreshToken: refreshToken.value,
        login: user.login,
        role: user.role
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
      const user = await User.create({login: login, password: await hashPassword(password)});

      const refreshToken = await RefreshToken.create({
        value: await createRefreshToken(user._id),
        userId: user._id
      });

      const token = createToken(user._id, user.role);

      ctx.response.status = 200;
      return ctx.response.body = {
        token: `Bearer ${token}`,
        refreshToken: refreshToken.value,
        login: user.login,
        role: user.role
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

      const user = await User.findOne({_id: oldRefreshToken.userId});

      if(!user.isActive) {
        ctx.response.status = 403;
        return ctx.response.body = {
          message: "Access denied"
        }
      }

      const newRefreshToken = await RefreshToken.create({
        value: await createRefreshToken(oldRefreshToken.userId),
        userId: oldRefreshToken.userId
      });

      const token = createToken(newRefreshToken.userId, user.role);

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

  testRouter.post("/create-admin", async ctx => {
    return await User.create({login: "admin", password: await hashPassword("admin"), role: "admin"});
  });

  return [authRouter.routes(), testRouter.routes()];
}
