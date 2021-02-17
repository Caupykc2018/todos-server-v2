import { IContext, IUpdateDataTodo } from '../../interfaces';
import { emitSocketsById } from '../../socket/emits';
import { SET_TODO, SOCKET_CHANGES } from '../../constants';

export const updateTodo = async (ctx: IContext) => {
  const { todoRepository } = ctx;
  const { socketid: SocketId } = ctx.request.header;
  const { user } = ctx.state;
  const { todoId } = ctx.params;

  const { title, isCompleted } = ctx.request.body;

  const updateData: IUpdateDataTodo = {};

  if (typeof title === 'string') {
    if (title === '') {
      ctx.response.status = 400;
      ctx.response.body = {
        message: 'Title can not be empty',
      };
      return;
    }

    updateData.title = title;
  }

  if (typeof isCompleted === 'boolean') {
    updateData.isCompleted = isCompleted;
  }

  if (!Object.keys(updateData).length) {
    ctx.response.status = 400;
    ctx.response.body = {
      message: 'No data for edit',
    };
    return;
  }

  try {
    const todo = await todoRepository.findByIdAndUpdate(
      Number(todoId),
      user.id,
      updateData
    );

    if (!todo) {
      ctx.response.status = 403;
      ctx.response.body = {
        message: 'You have not access for edit this todo',
      };
      return;
    }

    if (SocketId) {
      emitSocketsById(
        SOCKET_CHANGES,
        { type: SET_TODO, payload: { todo } },
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
