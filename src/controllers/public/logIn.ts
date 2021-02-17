import { IContext } from '../../interfaces';
import { createToken } from '../../utilities';

export const logIn = async (ctx: IContext) => {
  const { userRepository, refreshTokenRepository } = ctx;
  const { login, password } = ctx.request.body;

  try {
    const user = await userRepository.findOne({ login });

    if (!user) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: 'Incorrect logIn or password',
      };
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: 'Incorrect logIn or password',
      };
      return;
    }

    if (!user.isActive) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: 'Access denied',
      };
      return;
    }

    await refreshTokenRepository.delete({ userId: user.id });

    const refreshToken = await refreshTokenRepository.createAndSave(user.id);

    const token = createToken(user.id);

    ctx.response.status = 200;
    ctx.response.body = {
      id: user.id,
      token: `Bearer ${token}`,
      refreshToken: refreshToken.value,
      login: user.login,
      role: user.role,
    };
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: e.message,
    };
  }
};
