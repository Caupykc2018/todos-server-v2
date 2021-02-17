import { IContext } from '../../interfaces';
import { createToken } from '../../utilities';
import { emitAll } from '../../socket/emits';
import { ADD_USER, SOCKET_CHANGES } from '../../constants';

export const register = async (ctx: IContext) => {
  const { userRepository, refreshTokenRepository } = ctx;
  const { login, password } = ctx.request.body;

  if (!login || !password) {
    ctx.status = 400;
    ctx.response.body = {
      message: 'Not all fields filled',
    };
    return;
  }

  if (login.length < 3) {
    ctx.status = 400;
    ctx.response.body = {
      message: 'Login must have at least 3 characters',
    };
    return;
  }
  if (login.length > 16) {
    ctx.status = 400;
    ctx.response.body = {
      message: 'The maximum login length is 16 characters',
    };
    return;
  }
  if (password.length < 8) {
    ctx.status = 400;
    ctx.response.body = {
      message: 'Password must have at least 8 characters',
    };
    return;
  }
  if (password.length > 32) {
    ctx.status = 400;
    ctx.response.body = {
      message: 'The maximum password length is 32 characters',
    };
    return;
  }

  try {
    const user = await userRepository.createAndSave(login, password);
    const refreshToken = await refreshTokenRepository.createAndSave(user.id);
    const token = createToken(user.id);

    emitAll(SOCKET_CHANGES, {
      type: ADD_USER,
      payload: { user },
      role: 'admin',
    });

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
      message: 'Login is not unique',
    };
  }
};
