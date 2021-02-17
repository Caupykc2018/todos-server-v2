import { IContext } from '../interfaces';

export const adminGuard = async (ctx: IContext, next) => {
  const { user } = ctx.state;

  if (user.role !== 'admin') {
    ctx.response.status = 403;
    ctx.response.body = {
      message: 'You have not permission',
    };
    return;
  }

  await next();
};
