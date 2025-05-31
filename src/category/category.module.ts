import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Category, Book])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
