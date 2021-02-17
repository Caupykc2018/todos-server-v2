import { IContext } from '../../interfaces';

export const getAllUsers = async (ctx: IContext) => {
  const { userRepository } = ctx;

  try {
    const users = await userRepository.find();

    ctx.response.status = 200;
    ctx.response.body = users.map((user) => ({
      id: user.id,
      login: user.login,
      isActive: user.isActive,
      role: user.role,
    }));
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
};
