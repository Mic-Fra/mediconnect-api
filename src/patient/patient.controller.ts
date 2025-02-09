import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Delete, 
  Patch, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException ,
  Query
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './patient.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';

@Controller('patients')  // ✅ Fixed controller route
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // ✅ Register a new patient (WITHOUT file upload)
  @Post('register')
  async registerPatient(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.createPatient(createPatientDto);
  }

  // ✅ Get all patients
  @Get('get-all')
  async getAllPatients(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  // ✅ Get only active patients
  @Get('active-patients')
  async getActivePatients() {
    return await this.patientService.getActivePatients();
  }


  @Get('search')
  async searchPatients(
    @Query('name') name?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 5,
  ) {
    return await this.patientService.searchPatient({
      name,
      page: Number(page),
      limit: Number(limit),
    });
  }

  // ✅ Get patient by ID (ID should be string as UUID)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<Patient> {  // ID is string (UUID)
    const user = await this.patientService.findOne(id);  // Use the findOne method
    return user;
  }

  // ✅ Delete all patients
  @Delete('delete-all')
  async deleteAllPatients(): Promise<void> {
    await this.patientService.deleteAllPatients();
  }

  // ✅ Delete a specific patient by ID (ID should be string as UUID)
  @Delete(':id')
  async deletePatient(@Param('id') id: string): Promise<{ message: string }> {  // ID is string (UUID)
    console.log(`Deleting patient with ID: ${id}`);
    
    await this.patientService.removePatient(id);
    return { message: "Patient deleted successfully" };
  }

  // ✅ Upload patient documents (e.g., images, medical records)
  @Post('upload')  
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/patients',  // ✅ Ensure correct directory
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadPatientFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    const fileUrl = `/uploads/patients/${file.filename}`;
    return { url: fileUrl };  // ✅ Return file URL
  }

  // ✅ Toggle patient active status (ID should be string as UUID)




  

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return this.patientService.toggleActive(id);
  }
}
