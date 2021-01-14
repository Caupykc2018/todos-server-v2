import Router from "koa-router";

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

      ctx.response.status = 200
      return ctx.response.body = {
          id: user._id,
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

      ctx.body = {
        id: user._id,
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
