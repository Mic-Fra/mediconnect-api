// users.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>, 
  ) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const user = this.usersRepository.create({ ...createUserDto });
    return await this.usersRepository.save(user);
  }

  async deleteAllUsers(): Promise<void> {
    // Delete all users from the table
    await this.usersRepository.clear(); // This deletes all rows

    // Reset the sequence to start from 1
    await this.usersRepository.query('SELECT setval(\'users_id_seq\', 1, false)');
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersRepository.delete(id);  // Deletes the user
  }

  async deleteUserAndResetId(id: string): Promise<void> {
    // Delete the user by ID
    await this.usersRepository.delete(id);
  
    // Get the highest current ID in the table
    const maxId = await this.usersRepository.query('SELECT MAX(id) FROM users');
    const newId = maxId[0].max || 0; // If no rows, reset to 0
    await this.usersRepository.query(`SELECT setval('users_id_seq', ${newId}, false)`);
  }


  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async toggleUserAccess(userId: string, isActive: boolean): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.isActive = isActive;
    return this.usersRepository.save(user);
  }

  async getActiveUsers() {
    return await this.usersRepository.find({ where: { isActive: true } }); // ✅ Get only active users
  }
  
  async findOne(id: string) {
    if (!this.isUUID(id)) {
      throw new BadRequestException('Invalid UUID');
    }
  
    return this.usersRepository.findOneBy({ id });
  }

  private isUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  async findById(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<Users>): Promise<Users> {
    await this.usersRepository.update(id, updateData); // Updates the user
    return this.findById(id); // Fetch and return the updated user
  }

  async toggleActive(id: string): Promise<{ isActive: boolean }> {
    const user = await this.findById(id);
    user.isActive = !user.isActive;
    await this.updateUser(id, { isActive: user.isActive });
    return { isActive: user.isActive };
  }

  async getPaginatedUsers(page: number, limit: number) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException("Page and limit must be greater than 0");
    }
  
    const skip = (page - 1) * limit;
  
    try {
      // Fetch paginated users
      const [users, total] = await this.usersRepository.findAndCount({
        skip,
        take: limit,
      });
  
      return {
        data: users,
        total, // Total number of records
        page,
        lastPage: Math.max(1, Math.ceil(total / limit)), // Ensure at least 1 page
      };
    } catch (error) {
      console.error("Error fetching paginated users:", error);
      throw new Error("Database query failed");
    }
  }

  async searchUsers({
    name,
    specialty,
    page,
    limit,
  }: {
    name?: string;
    specialty?: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    // Build the search query
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (name && name.trim()) {
      queryBuilder.andWhere(
        `LOWER(CONCAT(user.firstname, ' ', user.lastname)) LIKE LOWER(:name)`,
        { name: `%${name.trim().toLowerCase()}%` }
      );
    }

    if (specialty) {
      queryBuilder.andWhere(
        `(
          EXISTS (
            SELECT 1 FROM unnest(user.general) AS g WHERE LOWER(g) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.surgical) AS s WHERE LOWER(s) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.medical) AS m WHERE LOWER(m) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.pediatric) AS p WHERE LOWER(p) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.other) AS o WHERE LOWER(o) LIKE LOWER(:specialty)
          )
        )`,
        { specialty: `%${specialty.toLowerCase()}%` }
      );
    }
    
    

    // Pagination
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      page,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async searchUsersisactive({
    name,
    specialty,
    page,
    limit,
  }: {
    name?: string;
    specialty?: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    // Build the search query
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    queryBuilder.where('user.isActive = :isActive', { isActive: true });

    if (name && name.trim()) {
      queryBuilder.andWhere(
        `LOWER(CONCAT(user.firstname, ' ', user.lastname)) LIKE LOWER(:name)`,
        { name: `%${name.trim().toLowerCase()}%` }
      );
    }

    if (specialty) {
      queryBuilder.andWhere(
        `(
          EXISTS (
            SELECT 1 FROM unnest(user.general) AS g WHERE LOWER(g) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.surgical) AS s WHERE LOWER(s) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.medical) AS m WHERE LOWER(m) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.pediatric) AS p WHERE LOWER(p) LIKE LOWER(:specialty)
          ) OR EXISTS (
            SELECT 1 FROM unnest(user.other) AS o WHERE LOWER(o) LIKE LOWER(:specialty)
          )
        )`,
        { specialty: `%${specialty.toLowerCase()}%` }
      );
    }
    
    
    

    // Pagination
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      page,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }
  }

