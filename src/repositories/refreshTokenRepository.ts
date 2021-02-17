import { EntityRepository, MongoRepository } from 'typeorm';
import { RefreshToken } from '../models';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends MongoRepository<RefreshToken> {
  async createAndSave(userId: number): Promise<RefreshToken> {
    const refreshToken = await this.create({
      userId,
    });

    await this.save(refreshToken);

    return refreshToken;
  }

  async findByValueAndDelete(value: string): Promise<RefreshToken> {
    const refreshToken = await this.findOne({ value });

    if (!refreshToken) return null;

    await this.delete({ id: refreshToken.id });

    return refreshToken;
  }
}
