import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // check if user exists
    const user = await this.userRepository.findOneBy({
      id: createProfileDto.userId,
    });
    if (!user) {
      throw new Error(`User with id ${createProfileDto.userId} does not exist`);
    }
    // create the profile
    const profile = this.profileRepository.create({
      ...createProfileDto,
      user,
    });

    return await this.profileRepository
      .save(profile)
      .then((profile) => {
        return profile;
      })
      .catch((err) => {
        throw new Error(`Error creating profile: ${err}`);
      });
  }

  async findAll() {
    return await this.profileRepository.find();
  }

  async findOne(id: number): Promise<Profile | string> {
    return await this.profileRepository
      .findOneBy({ id })
      .then((profile) => {
        if (!profile) {
          throw new Error(`Profile with id ${id} not found`);
        }
        return profile;
      })
      .catch((err) => {
        throw new Error(`Error finding profile: ${err}`);
      });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    await this.profileRepository.update(id, updateProfileDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.profileRepository
      .delete(id)
      .then((res) => {
        if (res.affected === 0) {
          throw new Error(`User with id ${id} not found`);
        }
        return `User with id ${id} deleted successfully`;
      })
      .catch((err) => {
        throw new Error(`Error deleting user with id ${id}: ${err}`);
      });
  }
}
