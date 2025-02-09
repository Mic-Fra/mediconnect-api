import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  ParseUUIDPipe, 
  Delete,
  Patch,
  UseInterceptors, 
  UploadedFile, 
  Query,
  NotFoundException,
  BadRequestException,
  HttpException, HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint to register a new user (WITHOUT file upload)
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('paginated')
  async getPaginatedUsers(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum)) {
      throw new BadRequestException("Page and limit must be numbers");
    }

    return this.usersService.getPaginatedUsers(pageNum, limitNum);
  }


  // Endpoint to get all users
  @Get('get-all')
  async getAllUsers(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  // Get active users
  @Get('active-users')
  async getActiveUsers() {
    return await this.usersService.getActiveUsers();
  }

  // Get user by ID
  

  @Get('search')
  async searchUsers(
    @Query('name') name?: string,
    @Query('specialty') specialty?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
  ) {
    return await this.usersService.searchUsers({
      name,
      specialty,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('search-isactive')
  async searchUsersisactive(
    @Query('name') name?: string,
    @Query('specialty') specialty?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
  ) {
    return await this.usersService.searchUsersisactive({
      name,
      specialty,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
async getUser(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.usersService.findOne(id);
}

  // Endpoint to delete all users
  @Delete('delete-all')
  async deleteAllUsers(): Promise<void> {
    await this.usersService.deleteAllUsers();
  }

  // Endpoint to delete a user by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {  // id is now string
    return this.usersService.removeUser(id);
  }

  // File upload endpoint
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File upload failed');
    }

    const fileUrl = `/uploads/users/${file.filename}`;
    return { url: fileUrl };  // Return the image URL
  }

  // Toggle user access
  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return this.usersService.toggleActive(id);
  }
}
