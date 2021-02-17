import { IContext } from '../../interfaces';
import { emitSocketsById } from '../../socket/emits';
import { SET_TODOS, SOCKET_CHANGES } from '../../constants';

export const updateManyTodos = async (ctx: IContext) => {
  const { todoRepository } = ctx;
  const { socketid: SocketId } = ctx.request.header;
  const { user } = ctx.state;
  const { todoIds, isCompleted } = ctx.request.body;

  if (typeof isCompleted !== 'boolean') {
    ctx.response.status = 400;
    ctx.response.body = {
      message: 'No data for edit',
    };
    return;
  }

  try {
    const todos = await todoRepository.findByArrayIdsAndUpdate(
      todoIds,
      user.id,
      isCompleted
    );

    if (SocketId) {
      emitSocketsById(
        SOCKET_CHANGES,
        { type: SET_TODOS, payload: { todos } },
        user.id,
        SocketId
      );
    }

    ctx.response.status = 200;
    ctx.response.body = todos;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: e.message,
    };
  }
};
