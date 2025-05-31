import { IsDateString, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  bio: string;

  @IsUrl()
  avatar: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  location: string;

  @IsNumber()
  userId: string;
}
