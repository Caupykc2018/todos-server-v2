import { IContext } from '../../interfaces';
import { emitSocketsById } from '../../socket/emits';
import { REMOVE_TODOS, SOCKET_CHANGES } from '../../constants';

export const deleteManyTodos = async (ctx: IContext) => {
  const { todoRepository } = ctx;
  const { todoIds } = ctx.request.body;
  const { socketid: SocketId } = ctx.request.header;
  const { user } = ctx.state;

  try {
    const todos = await todoRepository.findByArrayIdsAndDelete(
      todoIds,
      user.id
    );

    if (SocketId) {
      emitSocketsById(
        SOCKET_CHANGES,
        { type: REMOVE_TODOS, payload: { todos } },
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
