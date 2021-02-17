import { EntityRepository, In, Repository } from 'typeorm';
import { Todo, User } from '../models';
import { IUpdateDataTodo } from '../interfaces';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  async createAndSave(title: string, user: User): Promise<Todo> {
    const todo = this.create({ title, userId: user.id });

    await this.save(todo);

    return todo;
  }

  async findByIdAndDelete(id: number, userId: number) {
    const todo = await this.findOne({ id, userId });

    if (!todo) return null;

    const resultTodo = { ...todo };

    await this.remove(todo);

    return resultTodo;
  }

  async findByArrayIdsAndDelete(ids: number[], userId: number) {
    const todos = await this.find({ id: In(ids), userId });

    if (!todos) return [];

    const resultTodos = todos.map((todo) => ({ ...todo }));

    await this.remove(todos);

    return resultTodos;
  }

  async findByIdAndUpdate(
    id: number,
    userId: number,
    updateData: IUpdateDataTodo
  ): Promise<Todo> {
    const todo = await this.findOne({ id, userId });

    if (!todo) return null;

    const updatedTodo = { ...todo, ...updateData };

    await this.save(updatedTodo);

    return updatedTodo;
  }

  async findByArrayIdsAndUpdate(
    ids: number[],
    userId: number,
    isCompleted: boolean
  ) {
    const todos = await this.find({ id: In(ids), userId });

    if (!todos.length) return [];

    const updatedTodos = todos.map((todo) => ({ ...todo, isCompleted }));

    await this.save(updatedTodos);

    return updatedTodos;
  }

  async toggleAll(user: User): Promise<Todo[]> {
    const activeTodos = await this.find({
      isCompleted: false,
      userId: user.id,
    });

    let editedTodos;

    if (activeTodos.length) {
      editedTodos = activeTodos.map((todo) => ({
        ...todo,
        isCompleted: true,
      }));
    } else {
      const allTodos = await this.find({ userId: user.id });

      editedTodos = allTodos.map((todo) => ({ ...todo, isCompleted: false }));
    }

    await this.save(editedTodos);

    return editedTodos;
  }

  async clearCompleted(user: User): Promise<Todo[]> {
    const completedTodos = await this.find({
      isCompleted: true,
      userId: user.id,
    });

    const resultTodos = completedTodos.map((todo) => ({ ...todo }));

    await this.remove(completedTodos);

    return resultTodos;
  }
}
