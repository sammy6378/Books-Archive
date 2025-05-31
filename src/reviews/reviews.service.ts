import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOneBy({
      id: createReviewDto.userId,
    });
    if (!user) {
      throw new Error(`User with id ${createReviewDto.userId} does not exist`);
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
    });

    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new Error(`Review with id ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    await this.reviewRepository.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<string> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Review with id ${id} not found`);
    }
    return `Review with id ${id} deleted successfully`;
  }
}
