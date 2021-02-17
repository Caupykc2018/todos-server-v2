import { IContext } from '../../interfaces';
import { emitAll } from '../../socket/emits';
import { REMOVE_USERS, SOCKET_CHANGES } from '../../constants';

export const deleteManyUsers = async (ctx: IContext) => {
  const { userRepository } = ctx;
  const { userIds } = ctx.request.body;
  const { socketid: SocketId } = ctx.request.header;

  try {
    const users = await userRepository.findByArrayIdsAndDelete(userIds);

    if (SocketId) {
      emitAll(
        SOCKET_CHANGES,
        { type: REMOVE_USERS, payload: { users }, role: 'admin' },
        SocketId
      );
    }

    ctx.response.status = 200;
    ctx.response.body = users.map((user) => ({
      id: user.id,
      login: user.login,
      isActive: user.isActive,
      role: user.role,
    }));
    return;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: e.message,
    };
  }
};
