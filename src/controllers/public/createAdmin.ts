import { IContext } from '../../interfaces';

export const createAdmin = async (ctx: IContext) => {
  const { userRepository } = ctx;
  const user = userRepository.create({
    login: 'admin',
    password: 'admin',
    role: 'admin',
  });

  await userRepository.save(user);

  ctx.response.status = 200;
  ctx.response.body = user;
};
