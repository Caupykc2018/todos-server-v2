import { IContext, IUpdateDataUser } from '../../interfaces';
import {
  INFO,
  ROLES,
  SET_DATA_CURRENT_USER,
  SET_NOTIFICATION,
  SET_USERS,
  SOCKET_CHANGES,
} from '../../constants';
import { emitAll, emitSocketsById } from '../../socket/emits';

export const updateManyUsers = async (ctx: IContext) => {
  const { user: currentUser } = ctx.state;
  const { userRepository } = ctx;
  const { socketid: SocketId } = ctx.request.header;
  const { userIds, isActive, role } = ctx.request.body;

  const updateData: IUpdateDataUser = {};

  const messages = [];

  if (typeof isActive === 'boolean') {
    updateData.isActive = isActive;
    messages.push(
      `status your account on "${isActive ? 'active' : 'disable'}"`
    );
  }

  if (typeof role === 'string') {
    if (!ROLES.find((el) => el === role)) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: `Incorrect role ${role}`,
      };
      return;
    }
    updateData.role = role;
    messages.push(`your role on "${role}"`);
  }

  const users = await userRepository.findByArrayIdsAndUpdate(
    userIds,
    updateData
  );

  if (SocketId) {
    users.map((user) =>
      emitSocketsById(
        SOCKET_CHANGES,
        {
          type: SET_DATA_CURRENT_USER,
          payload: { user },
        },
        user.id
      ));

    users.map((user) =>
      emitSocketsById(
        SOCKET_CHANGES,
        {
          type: SET_NOTIFICATION,
          payload: {
            notification: {
              message: `Admin "${currentUser.login}" update ${messages.join(
                ' and '
              )}`,
              type: INFO,
            },
          },
        },
        user.id
      ));

    emitAll(
      SOCKET_CHANGES,
      { type: SET_USERS, payload: { users }, role: 'admin' },
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
};
