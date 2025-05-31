import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  publicationYear: number;

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  authorId: string;
}
