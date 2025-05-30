import { IsDateString, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsNumber()
  id: number;

  @IsString()
  bio: string;

  @IsUrl()
  avatar: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  location: string;
}
