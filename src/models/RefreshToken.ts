import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class RefreshToken {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('string', { unique: true })
  value: string;

  @Column('number', { unique: true })
  userId: number;

  @BeforeInsert()
  async beforeInsert() {
    this.value = await bcrypt.hash(`${this.userId}${new Date().getTime()}`, 8);
  }
}
