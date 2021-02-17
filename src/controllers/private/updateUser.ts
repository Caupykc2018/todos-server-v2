import { IContext, IUpdateDataUser } from '../../interfaces';
import { emitAll, emitSocketsById } from '../../socket/emits';
import {
  INFO,
  ROLES,
  SET_DATA_CURRENT_USER,
  SET_NOTIFICATION,
  SET_USER,
  SOCKET_CHANGES,
} from '../../constants';

export const updateUser = async (ctx: IContext) => {
  const { user: currentUser } = ctx.state;
  const { userRepository } = ctx;
  const { socketid: SocketId } = ctx.request.header;
  const { userId } = ctx.params;
  const { isActive, role } = ctx.request.body;

  const updateData: IUpdateDataUser = {};

  let message;

  if (typeof isActive === 'boolean') {
    updateData.isActive = isActive;
    message = `Admin "${currentUser.login}" update status your account on "${
      isActive ? 'active' : 'disable'
    }"`;
  }

  if (typeof role === 'string') {
    if (!ROLES.find((el) => el === role)) {
      ctx.response.status = 400;
      return (ctx.response.body = {
        message: `Incorrect role ${role}`,
      });
    }
    updateData.role = role;
    message = `Admin "${currentUser.login}" update your role on "${role}"`;
  }

  const user = await userRepository.findByIdAndUpdate(
    Number(userId),
    updateData
  );

  if (SocketId) {
    emitSocketsById(
      SOCKET_CHANGES,
      { type: SET_DATA_CURRENT_USER, payload: { user } },
      user.id
    );

    emitSocketsById(
      SOCKET_CHANGES,
      {
        type: SET_NOTIFICATION,
        payload: { notification: { message, type: INFO } },
      },
      user.id
    );

    emitAll(
      SOCKET_CHANGES,
      { type: SET_USER, payload: { user }, role: 'admin' },
      SocketId
    );
  }

  ctx.response.status = 200;
  ctx.response.body = user;
};
