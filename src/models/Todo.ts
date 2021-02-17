import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column('boolean', { default: false })
  isCompleted: boolean = false;

  @Column('int', { nullable: false })
  userId: number;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert?() {
    this.createdAt = new Date();
  }
}
