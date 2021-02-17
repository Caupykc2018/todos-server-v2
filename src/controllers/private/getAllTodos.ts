import {
  Between,
  FindOperator,
  LessThan,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import * as moment from 'moment';
import { IContext } from '../../interfaces';

export const getAllTodos = async (ctx: IContext) => {
  const { todoRepository } = ctx;
  const { user } = ctx.state;
  const { start, end, search } = ctx.request.query;
  const filters: { createdAt?: FindOperator<string> } = {};

  const convertStartDate = start && moment(new Date(Number(start))).format();
  const convertEndDate = end && moment(new Date(Number(end))).format();

  if (start && end) {
    filters.createdAt = Between(convertStartDate, convertEndDate);
  } else if (start) {
    filters.createdAt = MoreThanOrEqual(convertStartDate);
  } else if (end) {
    filters.createdAt = LessThan(convertEndDate);
  }

  try {
    const todos = await todoRepository.find({
      userId: user.id,
      title: Like(`%${search || ''}%`),
      ...filters,
    });

    ctx.response.status = 200;
    ctx.response.body = todos;
  } catch (e) {
    ctx.response.status = 400;
    ctx.response.body = e;
  }
};
