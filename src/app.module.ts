import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { CategoryModule } from './category/category.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DatabaseModule } from './database/database.module';
import { LogsModule } from './logs/logs.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    ProfileModule,
    AuthorsModule,
    BooksModule,
    CategoryModule,
    ReviewsModule,
    DatabaseModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        '/users',
        '/authors',
        '/books',
        '/reviews',
        '/category',
        '/profile',
      );
  }
}
