import Router from "koa-router";
import JWT from "koa-jwt";
import {User, Todo, RefreshToken} from "../models";
import config from "../config";


export const privateRoutes = () => {
  const todosRouter = new Router({
    prefix: "/todos"
  });

  const usersRouter = new Router({
    prefix: "/users"
  });

  const decodeToken = JWT({
    secret: config.secretToken,
    key: "user",
    passthrough: true
  });

  const authMiddleware = async (ctx, next) => {
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

      if(!authUser.isActive) {
        ctx.response.status = 401;
        return ctx.response.body = {
          message: "Your account is not active"
        };
      }

      ctx.state.user.role = authUser.role;

      await next();
    }
  }

  const adminGuard = async (ctx, next) => {
    const {user} = ctx.state;

    if(user.role !== "admin") {
      ctx.response.status = 403;
      return ctx.response.body = {
        message: "You have not permission"
      }
    }

    await next();
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

  usersRouter.get("/", async ctx => {
    const users = await User.find({});

    ctx.response.status = 200;
    return ctx.response.body = users.map(user => ({
      _id: user._id,
      login: user.login,
      isActive: user.isActive,
      role: user.role
    }));
  });

  usersRouter.put("/:userId", async ctx => {
    const {userId} = ctx.params;
    const {isActive, role} = ctx.request.body;

    const updateData = {};

    if(typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if(typeof role === "string") {
      updateData.role = role;
    }

    const user = await User.findOneAndUpdate({_id: userId}, updateData, {new: true});

    ctx.response.status = 200;
    return ctx.response.body = {
      _id: user._id,
      login: user.login,
      isActive: user.isActive,
      role: user.role
    };
  });

  usersRouter.del("/:userId", async ctx => {
    const {userId} = ctx.params;

    const user = await User.findOneAndDelete({_id: userId});

    await Todo.deleteMany({userId: user._id});
    await RefreshToken.deleteMany({userId: user._id});

    ctx.response.status = 200;
    return ctx.response.body = {
      _id: user._id,
      login: user.login,
      isActive: user.isActive,
      role: user.role
    };
  });

  return [decodeToken, authMiddleware, todosRouter.routes(), adminGuard, usersRouter.routes()];
}


