import * as Router from 'koa-router';
import { getAllTodos } from '../controllers/private/getAllTodos';
import { createTodo } from '../controllers/private/createTodo';
import { deleteTodo } from '../controllers/private/deleteTodo';
import { updateTodo } from '../controllers/private/updateTodo';
import { toggleAllTodos } from '../controllers/private/toggleAllTodos';
import { clearCompletedTodos } from '../controllers/private/clearCompletedTodos';
import { getAllUsers } from '../controllers/private/getAllUsers';
import { updateUser } from '../controllers/private/updateUser';
import { deleteUser } from '../controllers/private/deleteUser';
import { auth } from '../middlewares/auth';
import { adminGuard } from '../middlewares/adminGuard';
import { decodeToken } from '../middlewares/decodeToken';
import { deleteManyUsers } from '../controllers/private/deleteManyUsers';
import { updateManyUsers } from '../controllers/private/updateManyUsers';
import { updateManyTodos } from '../controllers/private/updateManyTodos';
import { deleteManyTodos } from '../controllers/private/deleteManyTodos';

export const privateRoutes = () => {
  const todosRouter = new Router({
    prefix: '/todos',
  });

  const usersRouter = new Router({
    prefix: '/users',
  });

  todosRouter.get('/', getAllTodos);
  todosRouter.post('/', createTodo);
  todosRouter.del('/:todoId', deleteTodo);
  todosRouter.del('/', deleteManyTodos);
  todosRouter.put('/:todoId', updateTodo);
  todosRouter.put('/', updateManyTodos);
  todosRouter.post('/toggle-all', toggleAllTodos);
  todosRouter.post('/clear-completed', clearCompletedTodos);

  usersRouter.get('/', getAllUsers);
  usersRouter.put('/:userId', updateUser);
  usersRouter.put('/', updateManyUsers);
  usersRouter.del('/:userId', deleteUser);
  usersRouter.del('/', deleteManyUsers);

  return [
    decodeToken,
    auth,
    todosRouter.routes(),
    adminGuard,
    usersRouter.routes(),
  ];
};
