import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Author } from 'src/authors/entities/author.entity';
import { Book } from 'src/books/entities/book.entity';
import { Category } from 'src/category/entities/category.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Profile, Author, Book, Category, Review]),
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
