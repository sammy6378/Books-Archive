import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  bio?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  //   relationships
  @OneToOne(() => User, (user) => user.profile)
  user: Relation<User>;
}
