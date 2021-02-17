import { IContext } from '../../interfaces';
import { emitSocketsById } from '../../socket/emits';
import { ADD_TODO, SOCKET_CHANGES } from '../../constants';

export const createTodo = async (ctx: IContext) => {
  const { todoRepository } = ctx;
  const { socketid } = ctx.request.header;
  const { user } = ctx.state;

  const { title } = ctx.request.body;

  if (!title) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: 'No title',
    };
    return;
  }

  try {
    const todo = await todoRepository.createAndSave(title, user);

    if (socketid) {
      emitSocketsById(
        SOCKET_CHANGES,
        { type: ADD_TODO, payload: { todo } },
        user.id,
        socketid
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
