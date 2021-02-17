import {
  BeforeInsert, Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  login: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'user' })
  role: string;

  @BeforeInsert()
  async beforeInsert?() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async comparePassword?(password) {
    return bcrypt.compare(password, this.password);
  }
}
