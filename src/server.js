import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import JWT from "koa-jwt";

import {connection, Todo, User} from "./models";

import {publicRoutes} from "./routes/public";


const bootstrap = async () => {
  await connection();

  const app = new Koa();

  const todosRouter = new Router({
    prefix: "/todos"
  });

  const rootRouter = new Router({
    prefix: "/api"
  });

  app.use(bodyParser());

  app.use(async(ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
    if(ctx.request.method === "OPTIONS") {
      ctx.response.status = 204;
    }
    else await next()
  });

  todosRouter.get('/', async ctx => {
    const userId = ctx.request.header["user-id"];

    if(!userId) {
      ctx.response.status = 401;
      return ctx.response.body = {
        message: "No id user"
      }
    }

    ctx.response.status = 200;
    return ctx.response.body = await Todo.find({userId: userId});
  });

  todosRouter.post('/', async ctx => {
    const userId = ctx.request.header["user-id"];
    const { title } = ctx.request.body;

    if(!userId) {
      ctx.response.status = 401;
      return ctx.response.body = {
        message: "No id user"
      }
    }

    try {
      const user = await User.findOne({_id: userId});
      
      if(!userId) {
        ctx.response.status = 400;
        return ctx.response.body = {
          message: "No title"
        }
      }

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
    const userId = ctx.request.header["user-id"];
    const {todoId} = ctx.params;

    if(!userId) {
      ctx.response.status = 401;
      return ctx.response.body = {
        message: "No user"
      }
    }

    try {
      ctx.response.status = 200;
      return ctx.response.body = await Todo.findOneAndDelete({_id: todoId});
    }
    catch(e) {
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      }
    }
  });

  todosRouter.put('/:todoId', async ctx => {
    const userId = ctx.request.header["user-id"];
    const {todoId} = ctx.params;

    const {title, isCompleted} = ctx.request.body;

    if(!userId) {
      ctx.response.status = 401;
      return ctx.response.body = {
        message: "No user"
      }
    }

    const updateData = {};

    if(typeof title === "string") {
      updateData.title = title;
    }

    if(typeof isCompleted === "boolean") {
      updateData.isCompleted = isCompleted;
    }

    try {
      ctx.response.status = 200;
      ctx.response.body = await Todo.findByIdAndUpdate({_id: todoId}, updateData, {new: true});
    }
    catch(e){
      ctx.response.status = 400;
      return ctx.response.body = {
        message: e.message
      }
    }
  });

  todosRouter.post('/toggle-all', async ctx => {
    const userId = ctx.request.header["user-id"];

    if(!userId) {
      ctx.response.status = 401;
      return ctx.response.body = {
        message: "No user"
      }
    }

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
    const userId = ctx.request.header["user-id"];

    if(!userId) {
      ctx.response.status = 401;
      return ctx.response.body = {
        message: "No user"
      }
    }

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

  rootRouter.use(...publicRoutes())
  rootRouter.use(todosRouter.routes());

  app.use(rootRouter.routes(), rootRouter.allowedMethods());

  return app;
}

export const startup = async () => {
  const app = await bootstrap();

  app.listen(3001, () => console.log("Server start"));
}

