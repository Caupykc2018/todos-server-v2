import { IContext } from '../../interfaces';
import { createToken } from '../../utilities';

export const refreshingToken = async (ctx: IContext) => {
  const { userRepository, refreshTokenRepository } = ctx;
  const { refreshToken } = ctx.request.body;

  try {
    const oldRefreshToken = await refreshTokenRepository.findByValueAndDelete(
      refreshToken
    );

    if (!oldRefreshToken) {
      ctx.response.status = 401;
      ctx.response.body = {
        message: 'Not found this token',
      };
      return;
    }

    const user = await userRepository.findOne(oldRefreshToken.userId);

    if (!user.isActive) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: 'Access denied',
      };
      return;
    }

    const newRefreshToken = await refreshTokenRepository.createAndSave(user.id);

    const token = createToken(newRefreshToken.userId);

    ctx.response.body = {
      id: user.id,
      token: `Bearer ${token}`,
      refreshToken: newRefreshToken.value,
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
