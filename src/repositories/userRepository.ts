import { EntityRepository, In, Repository } from 'typeorm';
import { User } from '../models';
import { IUpdateDataUser } from '../interfaces';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createAndSave(
    login: string,
    password: string,
    role: string = 'user',
    isActive: boolean = true
  ): Promise<User> {
    const user = this.create({
      login,
      password,
      role,
      isActive,
    });

    await this.save(user);

    return user;
  }

  async findByIdAndUpdate(
    id: number,
    updateData: IUpdateDataUser
  ): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = { ...user, ...updateData };

    await this.save(updatedUser);

    return updatedUser;
  }

  async findByArrayIdsAndUpdate(
    ids: number[],
    updateData: IUpdateDataUser
  ): Promise<User[]> {
    const users = await this.find({ id: In(ids) });
    const updatedUsers = users.map((user) => ({ ...user, ...updateData }));

    await this.save(updatedUsers);

    return updatedUsers;
  }

  async findByIdAndDelete(id: number): Promise<User> {
    const user = await this.findOne(id);
    const userId = user.id;

    await this.remove(user);
    user.id = userId;

    return user;
  }

  async findByArrayIdsAndDelete(ids: number[]): Promise<User[]> {
    const users = await this.find({ where: { id: In(ids) } });
    const returnedUsers = users.map((user) => ({ ...user }));

    await this.remove(users);

    return returnedUsers;
  }
}
