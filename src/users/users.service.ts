import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/hashPassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before saving the user
    if (createUserDto.password) {
      createUserDto.password = await hashPassword(createUserDto.password);
    }
    // Save the user to the database
    return await this.userRepository
      .save(createUserDto)
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw new Error(`Error creating user: ${err}`);
      });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User | string> {
    return await this.userRepository
      .findOneBy({ id })
      .then((user) => {
        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }
        return user;
      })
      .catch((err) => {
        throw new Error(`Error finding user with id ${id}: ${err}`);
      });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | string> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository
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
