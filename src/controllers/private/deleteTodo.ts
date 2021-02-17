import { IContext } from '../../interfaces';
import { emitSocketsById } from '../../socket/emits';
import { REMOVE_TODO, SOCKET_CHANGES } from '../../constants';

export const deleteTodo = async (ctx: IContext) => {
  const { todoRepository } = ctx;
  const { socketid: SocketId } = ctx.request.header;
  const { user } = ctx.state;
  const { todoId } = ctx.params;

  try {
    const todo = await todoRepository.findByIdAndDelete(
      Number(todoId),
      user.id
    );

    if (!todo) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: 'You have not access for delete this todo',
      };
      return;
    }

    if (SocketId) {
      emitSocketsById(
        SOCKET_CHANGES,
        { type: REMOVE_TODO, payload: { todo } },
        user.id,
        SocketId
      );
    }

    ctx.response.status = 200;
    ctx.response.body = todo;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: e.message,
    };
  }
};
