import * as moment from 'moment';
import { ITestData } from '../interfaces';
import { RefreshToken, Todo, User } from '../models';

export const testDataForMariaDB: ITestData<User | Todo>[] = [
  {
    model: User,
    name: 'users',
    data: [
      {
        login: 'user1',
        password: 'qwerty789',
      },
      {
        login: 'user2',
        password: 'qwerty789',
      },
      {
        login: 'user3',
        password: 'qwerty789',
        isActive: false,
      },
      {
        login: 'user4',
        password: 'qwerty789',
      },
      {
        login: 'user5',
        password: 'qwerty789',
      },
      {
        login: 'user6',
        password: 'qwerty789',
        isActive: false,
      },
      {
        login: 'user7',
        password: 'qwerty789',
      },
      {
        login: 'user8',
        password: 'qwerty789',
      },
      {
        login: 'user9',
        password: 'qwerty789',
      },
      {
        login: 'user10',
        password: 'qwerty789',
        isActive: false,
      },
      {
        login: 'user11',
        password: 'qwerty789',
      },
      {
        login: 'user12',
        password: 'qwerty789',
      },
      {
        login: 'user13',
        password: 'qwerty789',
      },
      {
        login: 'user14',
        password: 'qwerty789',
      },
      {
        login: 'user15',
        password: 'qwerty789',
      },
      {
        login: 'user16',
        password: 'qwerty789',
      },
      {
        login: 'user17',
        password: 'qwerty789',
      },
      {
        login: 'user18',
        password: 'qwerty789',
        role: 'admin',
      },
      {
        login: 'user19',
        password: 'qwerty789',
      },
      {
        login: 'user20',
        password: 'qwerty789',
      },
      {
        login: 'user21',
        password: 'qwerty789',
      },
      {
        login: 'user22',
        password: 'qwerty789',
      },
      {
        login: 'user23',
        password: 'qwerty789',
      },
      {
        login: 'user24',
        password: 'qwerty789',
      },
      {
        login: 'user25',
        password: 'qwerty789',
      },
      {
        login: 'user26',
        password: 'qwerty789',
      },
      {
        login: 'user27',
        password: 'qwerty789',
      },
      {
        login: 'user28',
        password: 'qwerty789',
      },
      {
        login: 'user29',
        password: 'qwerty789',
      },
      {
        login: 'user30',
        password: 'qwerty789',
      },
      {
        login: 'user31',
        password: 'qwerty789',
      },
    ],
  },
  {
    model: Todo,
    name: 'todos',
    data: [
      {
        title: '1todo_user7',
        userId: 7,
        createdAt: moment(new Date().setFullYear(2000, 11, 31)).format()
      },
      {
        title: '2todo_user7',
        userId: 7,
      },
      {
        title: '3todo_user7',
        userId: 7,
      },
      {
        title: '4todo_user7',
        userId: 7,
      },
      {
        title: '5todo_user7',
        userId: 7,
      },
      {
        title: '1todo_user13',
        userId: 13,
      },
      {
        title: '2todo_user13',
        userId: 13,
      },
      {
        title: '3todo_user13',
        userId: 13,
      },
      {
        title: '4todo_user13',
        userId: 13,
      },
      {
        title: '1todo_user14',
        userId: 14,
      },
      {
        title: '2todo_user14',
        userId: 14,
      },
      {
        title: '1todo_user15',
        userId: 15,
        isCompleted: true,
      },
      {
        title: '2todo_user15',
        userId: 15,
        isCompleted: true,
      },
      {
        title: '3todo_user15',
        userId: 15,
        isCompleted: true,
      },
      {
        title: '4todo_user15',
        userId: 15,
        isCompleted: true,
      },
      {
        title: '5todo_user15',
        userId: 15,
        isCompleted: true,
      },
      {
        title: '1todo_user16',
        userId: 16,
        isCompleted: true,
      },
      {
        title: '2todo_user16',
        userId: 16,
      },
      {
        title: '3todo_user16',
        userId: 16,
        isCompleted: true,
      },
      {
        title: '4todo_user16',
        userId: 16,
      },
      {
        title: '5todo_user16',
        userId: 16,
        isCompleted: true,
      },
      {
        title: '1todo_user17',
        userId: 17,
        isCompleted: true,
      },
      {
        title: '2todo_user17',
        userId: 17,
      },
      {
        title: '3todo_user17',
        userId: 17,
        isCompleted: true,
      },
      {
        title: '4todo_user17',
        userId: 17,
      },
      {
        title: '5todo_user17',
        userId: 17,
        isCompleted: true,
      },
      {
        title: '1todo_user22',
        userId: 22,
      },
      {
        title: '2todo_user22',
        userId: 22,
      },
      {
        title: '3todo_user22',
        userId: 22,
      },
      {
        title: '4todo_user22',
        userId: 22,
      },
      {
        title: '5todo_user22',
        userId: 22,
      },
    ],
  },
];

export const testDataForMongoDB: ITestData<RefreshToken>[] = [
  {
    model: RefreshToken,
    name: 'refreshTokens',
    data: [
      {
        userId: 5,
      },
      {
        userId: 6,
      },
      {
        userId: 22,
      },
    ],
  },
];
