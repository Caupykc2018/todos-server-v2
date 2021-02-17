import { IContext } from '../interfaces';

export const auth = async (ctx: IContext, next) => {
  const { userRepository } = ctx;
  const { jwtOriginalError, payload } = ctx.state;

  if (jwtOriginalError) {
    ctx.response.status = 401;
    ctx.response.body = {
      message: 'Authorized error',
    };
  } else {
    const authUser = await userRepository.findOne({ id: payload.id });

    if (!authUser) {
      ctx.response.status = 401;
      ctx.response.body = {
        message: 'Authorized error',
      };
      return;
    }

    if (!authUser.isActive) {
      ctx.response.status = 401;
      ctx.response.body = {
        message: 'Your account is not active',
      };
      return;
    }

    ctx.state.user = authUser;

    await next();
  }
};
