import Router from "koa-router";
import JWT from "koa-jwt";
import {User, Todo} from "../models";
import config from "../config";


export const privateRoutes = () => {
  const todosRouter = new Router({
    prefix: "/todos"
  });

  const authMiddleware = () => JWT({
    secret: config.secretToken,
    key: "user",
    passthrough: true
  });

  const handleValidToken = async (ctx, next) => {
    const {jwtOriginalError, user} = ctx.state;

    if(jwtOriginalError){
      ctx.response.status = 401;
      return ctx.response.body = {
        message: "Authorized error"
      };
    }
    else {
      const authUser = await User.findById(user.id);

      if(!authUser) {
        ctx.response.status = 401;
        return ctx.response.body = {
          message: "Authorized error"
        };
      }

      await next();
    }
  }

  todosRouter.get('/', async ctx => {
    const userId = ctx.state.user.id;

    ctx.response.status = 200;
    return ctx.response.body = await Todo.find({userId: userId});
  });

  todosRouter.post('/', async ctx => {
    const userId = ctx.state.user.id;
    const { title } = ctx.request.body;

    try {
      if(!title) {
        ctx.response.status = 400;
        return ctx.response.body = {
          message: "No title"
        }
      }

      ctx.body = await Todo.create({title: title, userId: userId});
    }
    catch(e){
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      }
    }
  });

  todosRouter.del('/:todoId', async ctx => {
    const userId = ctx.state.user.id;
    const {todoId} = ctx.params;

    try {
      ctx.response.status = 200;
      return ctx.response.body = await Todo.findOneAndDelete({_id: todoId, userId: userId});
    }
    catch(e) {
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      }
    }
  });

  todosRouter.put('/:todoId', async ctx => {
    const userId = ctx.state.user.id;
    const {todoId} = ctx.params;

    const {title, isCompleted} = ctx.request.body;

    const updateData = {};

    if(typeof title === "string") {
      updateData.title = title;
    }

    if(typeof isCompleted === "boolean") {
      updateData.isCompleted = isCompleted;
    }

    try {
      ctx.response.status = 200;
      ctx.response.body = await Todo.findByIdAndUpdate({_id: todoId, userId: userId}, updateData, {new: true});
    }
    catch(e){
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      }
    }
  });

  todosRouter.post('/toggle-all', async ctx => {
    const userId = ctx.state.user.id;

    try {
      const activeTodos = await Todo.find({isCompleted: false, userId: userId});
      let editedTodos;

      if(activeTodos.length) {
        editedTodos = activeTodos.map(todo => {
          todo.isCompleted = true;
          todo.save();
          return todo;
        });
      }
      else {
        const allTodos = await Todo.find({userId: userId});

        editedTodos = allTodos.map(todo => {
          todo.isCompleted = false;
          todo.save();
          return todo;
        });
      }

      ctx.response.status = 200;
      return ctx.response.body = editedTodos;
    }
    catch(e) {
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      }
    }
  });

  todosRouter.post('/clear-completed', async ctx => {
    const userId = ctx.state.user.id;

    try {
      const completedTodos = await Todo.find({isCompleted: true, userId: userId});

      completedTodos.forEach(todo => todo.remove());

      ctx.response.status = 200;
      return ctx.response.body = completedTodos;
    }
    catch(e) {
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      }
    }
  });

  return [authMiddleware(), handleValidToken, todosRouter.routes()];
}


