import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import {connection, Todo, User} from "./models";

const authController = {
  login: async ctx => {
    const {login, password} = ctx.request.body;

    const user = await User.findOne({login: login, password: password});
    ctx.assert(user, 404, "Incorrect login or password");

    ctx.body = {
      id: user._id,
      login: user.login
    };
  },
  register: async ctx => {
    const {login, password } = ctx.request.body;

    try {
      const user = await User.create({login: login, password: password});

      ctx.body = {
        id: user._id,
        login: user.login
      };
    }
    catch(e) {
      ctx.throw(400, "Login is not unique")
    }
  }
}

const authRouter = new Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);

const todosController = {
  getAll: async ctx => {
    const userId = ctx.request.header["user-id"];

    ctx.assert(userId, 401, "No user");

    ctx.body = await Todo.find({userId: userId});
  },
  create: async ctx => {
    const userId = ctx.request.header["user-id"];
    const { title } = ctx.request.body;

    ctx.assert(userId, 401, "No user");

    const user = await User.findOne({_id: userId});

    ctx.assert(user, 400, "Incorrect userId");

    ctx.assert(user, 400, "No title");

    ctx.body = await Todo.create({title: title, userId: userId});
  },
  deleteOneById: async ctx => {
    const userId = ctx.request.header["user-id"];
    const {todoId} = ctx.params;

    ctx.assert(userId, 401, "No user");

    ctx.body = await Todo.findOneAndDelete({_id: todoId});
  },
  updateOneById: async ctx => {
    const userId = ctx.request.header["user-id"];
    const {todoId} = ctx.params;

    const {title, isCompleted} = ctx.request.body;

    ctx.assert(userId, 401, "No user");

    const updateData = {};

    if(title instanceof String) {
      updateData.title = title;
    }

    if(isCompleted instanceof Boolean) {
      updateData.isCompleted = isCompleted;
    }

    ctx.body = await Todo.findByIdAndUpdate({_id: todoId}, updateData, {new: true});
  },
  toggleAll: async ctx => {
    const userId = ctx.request.header["user-id"];

    ctx.assert(userId, 401, "No user");

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

    ctx.body = editedTodos;
  },
  clearCompleted: async ctx => {
    const userId = ctx.request.header["user-id"];

    ctx.assert(userId, 401, "No user");

    const completedTodos = await Todo.find({isCompleted: true, userId: userId});

    completedTodos.forEach(todo => todo.remove());

    ctx.body = completedTodos;
  }
}

const todosRouter = new Router({
  prefix: "/todos"
});

todosRouter.get('/', todosController.getAll);
todosRouter.post('/', todosController.create);
todosRouter.del('/:todoId', todosController.deleteOneById);
todosRouter.put('/:todoId', todosController.updateOneById);
todosRouter.post('/toggle-all', todosController.toggleAll);
todosRouter.post('/clear-completed', todosController.clearCompleted);

const rootRouter = new Router({
  prefix: "/api"
});

rootRouter.use(authRouter.route());
rootRouter.use(todosRouter.route());

const bootstrap = async () => {
  await connection();

  const app = new Koa();

  app.use(bodyParser());
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    if(ctx.request.method === "OPTIONS") {
      ctx.status = 204;
    }
    else await next()
  });

  app.use(rootRouter.route());
  app.use(rootRouter.allowedMethods());

  return app;
}

export const startup = () => {
  const app = bootstrap();

  app.listen(3001);
}

