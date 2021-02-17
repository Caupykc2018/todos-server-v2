import { IContext } from '../../interfaces';
import { emitAll } from '../../socket/emits';
import { REMOVE_USER, SOCKET_CHANGES } from '../../constants';

export const deleteUser = async (ctx: IContext) => {
  const { userRepository, todoRepository, refreshTokenRepository } = ctx;
  const { socketid: SocketId } = ctx.request.header;
  const { userId } = ctx.params;

  const user = await userRepository.findByIdAndDelete(Number(userId));
  await todoRepository.delete({ userId: Number(userId) });
  await refreshTokenRepository.delete({ userId: Number(userId) });

  if (SocketId) {
    emitAll(
      SOCKET_CHANGES,
      { type: REMOVE_USER, payload: { user }, role: 'admin' },
      SocketId
    );
  }

  ctx.response.status = 200;
  ctx.response.body = {
    id: user.id,
    login: user.login,
    isActive: user.isActive,
    role: user.role,
  };
};
