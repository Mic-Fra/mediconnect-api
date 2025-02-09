import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientsRepository: Repository<Patient>, // ✅ Renamed for clarity
  ) {}

  // ✅ Create a new patient
  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientsRepository.create({ ...createPatientDto });
    return await this.patientsRepository.save(patient);
  }

  // ✅ Get all patients
  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }

  // ✅ Get only active patients
  async getActivePatients(): Promise<Patient[]> {
    return await this.patientsRepository.find({ where: { isActive: true } });
  }

  // ✅ Delete all patients
  async deleteAllPatients(): Promise<void> {
    await this.patientsRepository.clear(); // ✅ Deletes all rows

    // ✅ Reset the sequence in PostgreSQL
    await this.patientsRepository.query('SELECT setval(\'patients_id_seq\', 1, false)');
  }

  // ✅ Delete a specific patient by ID
  async removePatient(id: string): Promise<void> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
  
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  
    await this.patientsRepository.delete(id);
  }
  

  // ✅ Toggle patient active status
  async togglePatientAccess(userId: string, isActive: boolean): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id: userId } }); // ✅ `id` is now a string
  
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${userId} not found`);
    }
  
    patient.isActive = isActive;
    return this.patientsRepository.save(patient);
  }
  async findOne(id: string): Promise<Patient> {
    // Ensure 'id' is correctly matched with the column name in your entity
    const patient = await this.patientsRepository.findOne({ where: { id } });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  

  async getActivePatient() {
    return await this.patientsRepository.find({ where: { isActive: true } }); // ✅ Get only active users
  }

  async findById(id: string): Promise<Patient> {
    const user = await this.patientsRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<Patient>): Promise<Patient> {
    await this.patientsRepository.update(id, updateData); // Updates the user
    return this.findById(id); // Fetch and return the updated user
}

  

  async toggleActive(id: string): Promise<{ isActive: boolean }> {
    const user = await this.findById(id);
    user.isActive = !user.isActive;
    await this.updateUser(id, { isActive: user.isActive });
    return { isActive: user.isActive };
  }

  async searchPatient({
    name,
    page,
    limit,
  }: {
    name?: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    // Build the search query
    const queryBuilder = this.patientsRepository.createQueryBuilder('patient');

    if (name && name.trim()) {
      queryBuilder.andWhere(
        `LOWER(CONCAT(patient.firstname, ' ', patient.lastname)) LIKE LOWER(:name)`,
        { name: `%${name.trim().toLowerCase()}%` }
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
