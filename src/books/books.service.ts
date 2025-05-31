import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { title, description, publicationYear, authorId, categoryNames } =
      createBookDto;

    const author = await this.authorRepository.findOne({
      where: { id: authorId },
    });
    if (!author) throw new NotFoundException('Author not found');

    const categories: Category[] = [];

    for (const name of categoryNames) {
      let category = await this.bookRepository.manager.findOne(Category, {
        where: { name },
      });

      if (!category) {
        // Optionally create the category if not found
        category = this.bookRepository.manager.create(Category, {
          name,
          description: `${name} category`,
        });
        category = await this.bookRepository.manager.save(Category, category);
      }

      categories.push(category);
    }

    const book = this.bookRepository.create({
      title,
      description,
      publicationYear,
      author,
      categories,
    });

    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }

    // Handle optional author update
    if (updateBookDto.authorId) {
      const author = await this.authorRepository.findOneBy({
        id: updateBookDto.authorId,
      });
      if (!author) {
        throw new NotFoundException(
          `Author with id ${updateBookDto.authorId} not found`,
        );
      }
      book.author = author;
    }

    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: string): Promise<string> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return `Book with id ${id} has been deleted successfully`;
  }
}
