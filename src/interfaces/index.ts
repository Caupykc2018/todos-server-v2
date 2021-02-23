import { DeepPartial, EntityTarget } from 'typeorm';
import { ParameterizedContext, Request } from 'koa';
import { IRouterParamContext } from 'koa-router';
import { Server } from 'socket.io';
import { RefreshToken, Todo, User } from '../models';
import {
  RefreshTokenRepository,
  TodoRepository,
  UserRepository,
} from '../repositories';

export interface IUpdateDataTodo {
  title?: string;
  isCompleted?: boolean;
}

export interface IUpdateDataUser {
  role?: string;
  isActive?: boolean;
}

export interface IContextRepository {
  userRepository: UserRepository;
  todoRepository: TodoRepository;
  refreshTokenRepository: RefreshTokenRepository;
}

export interface ITestData<T> {
  data: DeepPartial<T>[];
  model: EntityTarget<T>;
  name: string;
}

export interface IInitializeTestData {
  todos?: Todo[];
  users?: User[];
  refreshTokens?: RefreshToken[];
}

export interface IContext
  extends ParameterizedContext<any, IRouterParamContext>,
    IContextRepository {
  state: {
    payload?: {
      id: number;
    };
    user?: User;
    jwtOriginalError?: any;
  };

  params: {
    todoId?: string;
    userId?: string;
  };

  body: {
    login?: string;
    password?: string;
    refreshToken?: string;
    title?: string;
    isCompleted?: boolean;
    isActive?: boolean;
    role?: string;
    userIds?: number[];
    todoIds?: number[];
  };

  request: {
    header: {
      socketid?: string
    },
    query: {
      sortCreatedAt?: 'ASC' | 'DESC'
    }
  } & Request

  io: Server;
}
