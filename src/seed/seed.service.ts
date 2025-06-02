import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { Book } from 'src/books/entities/book.entity';
import { Category } from 'src/category/entities/category.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { status } from 'src/users/dto/create-user.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    // inject repositories
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    this.logger.log('seeding started...');

    try {
      // clear tables
      await this.clearTables();

      // seed users
      const users = await this.seedUsers();

      // seed profiles
      await this.seedProfiles(users);

      // seed authors
      const authors = await this.seedAuthors();
      // seed categories
      const categories = await this.seedCategories();
      // seed books
      await this.seedBooks(authors, categories);
      // seed reviews
      await this.seedReviews(users);
      this.logger.log('seeding completed successfully');
      return { message: 'Seeding completed successfully' };
    } catch (error) {
      this.logger.error('Seeding failed', error);
      throw error;
    }
  }

  //   clearing all tables
  private async clearTables() {
    this.logger.log('Clearing tables...');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Order matters due to foreign key relationships
      await queryRunner.query('DELETE FROM books');
      await queryRunner.query('DELETE FROM reviews');
      await queryRunner.query('DELETE FROM categories');
      await queryRunner.query('DELETE FROM authors');
      await queryRunner.query('DELETE FROM profiles');
      await queryRunner.query('DELETE FROM users');

      //   await queryRunner.manager.clear(User);
      //   await queryRunner.manager.clear(Profile);
      //   await queryRunner.manager.clear(Author);
      //   await queryRunner.manager.clear(Book);
      //   await queryRunner.manager.clear(Category);
      //   await queryRunner.manager.clear(Review);
      await queryRunner.commitTransaction();
      this.logger.log('Tables cleared successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error clearing tables', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //   seeding data in users table
  private async seedUsers() {
    this.logger.log('Seeding users...');
    const users: User[] = [];

    for (let user = 1; user <= 200; user++) {
      const newUser = new User();
      newUser.name = faker.person.fullName();
      newUser.email = faker.internet.email({
        firstName: newUser.name.split(' ')[0],
        lastName: newUser.name.split(' ')[1],
        provider: 'university.com',
      });
      newUser.password = faker.internet.password();
      newUser.isActive = faker.datatype.boolean()
        ? status.ACTIVE
        : status.INACTIVE;
      users.push(await this.userRepository.save(newUser));
    }
    this.logger.log(`Seeded ${users.length} users`);
    return users;
  }

  //   seeding data in profiles table
  private async seedProfiles(users: User[]) {
    this.logger.log('Seeding profiles...');
    const profiles: Profile[] = [];

    for (const user of users) {
      const newProfile = new Profile();
      newProfile.user = user;
      newProfile.bio = faker.lorem.paragraph();
      newProfile.dateOfBirth = faker.date
        .between({
          from: '1950-01-01',
          to: Date.now(),
        })
        .toISOString();
      newProfile.avatar = faker.image.avatar();
      newProfile.location = faker.location.city();
      profiles.push(await this.profileRepository.save(newProfile));
    }
    this.logger.log(`Seeded ${profiles.length} profiles`);
    return profiles;
  }

  //   seeding data in authors table
  private async seedAuthors() {
    this.logger.log('Seeding authors...');
    const authors: Author[] = [];

    for (let author = 1; author <= 50; author++) {
      const newAuthor = new Author();
      newAuthor.name = faker.person.fullName();
      newAuthor.bio = faker.lorem.paragraph();
      newAuthor.isActive = faker.datatype.boolean();
      authors.push(await this.authorRepository.save(newAuthor));
    }
    this.logger.log(`Seeded ${authors.length} authors`);
    return authors;
  }

  //   seeding data in categories table
  private async seedCategories() {
    this.logger.log('Seeding categories...');
    const categories: Category[] = [];
    const categoryNames = [
      'Fiction',
      'Non-Fiction',
      'Science',
      'History',
      'Biography',
      'Fantasy',
      'Mystery',
      'Romance',
      'Thriller',
      'Self-Help',
    ];
    for (const name of categoryNames) {
      const newCategory = new Category();
      newCategory.name = name;
      newCategory.description = faker.lorem.sentence();
      categories.push(await this.categoryRepository.save(newCategory));
    }
    this.logger.log(`Seeded ${categories.length} categories`);
    return categories;
  }

  //   seeding data in books table
  private async seedBooks(authors: Author[], categories: Category[]) {
    this.logger.log('Seeding books...');
    const books: Book[] = [];
    for (let book = 1; book <= 100; book++) {
      const newBook = new Book();
      newBook.title = faker.word.words({ count: 3 });
      newBook.description = faker.lorem.paragraph();
      newBook.publicationYear = faker.date.past({ years: 10 }).getFullYear();
      newBook.author = faker.helpers.arrayElement(authors);
      newBook.categories = faker.helpers.arrayElements(categories, {
        min: 1,
        max: 3,
      });
      books.push(await this.bookRepository.save(newBook));
    }
    this.logger.log(`Seeded ${books.length} books`);
    return books;
  }

  //   seeding data in reviews table
  private async seedReviews(users: User[]) {
    this.logger.log('Seeding reviews...');
    const reviews: Review[] = [];
    for (let review = 1; review <= 300; review++) {
      const newReview = new Review();
      newReview.content = faker.lorem.paragraph();
      newReview.rating = faker.number.int({ min: 1, max: 5 });
      newReview.user = faker.helpers.arrayElement(users);
      reviews.push(await this.reviewRepository.save(newReview));
    }
    this.logger.log(`Seeded ${reviews.length} reviews`);
    return reviews;
  }
}
