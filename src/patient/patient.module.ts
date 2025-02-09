import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient } from './patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]), // ✅ Registers Patient entity with TypeORM
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService], // ✅ Exports service if needed in other modules
})
export class PatientModule {}
