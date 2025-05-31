import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  userId: string;
  // bookId: string; // Uncomment if you want to include bookId in the DTO
}
