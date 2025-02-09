import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import {Auth} from './auth/auth.entity'
import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/patient.entity';
import { DoctorDashboardModule } from './doctor-dashboard/doctor-dashboard.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    // TypeORM database configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'doctor_registration',
      entities: [Users, Auth, Patient],  // Your entity
      synchronize: true,   // Set to false for production
    }),
    
    // Serve static files (uploads directory)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve files from 'uploads' directory
      serveRoot: '/uploads',  // Access files through the '/uploads' URL path
    }),

    // Users module for user-related functionality
    UsersModule,

    AuthModule,

    PatientModule,

    DoctorDashboardModule,

    PassportModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
