import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  publicationYear: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Author, (author) => author.book, {
    onDelete: 'CASCADE',
  })
  author: Relation<Author>;

  @ManyToMany(() => Category, (category) => category.books, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  categories: Relation<Category[]>;
}
