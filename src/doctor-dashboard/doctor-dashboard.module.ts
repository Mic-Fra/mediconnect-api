import { Module } from '@nestjs/common';
import { DoctorDashboardController } from './doctor-dashboard.controller';
import { DoctorDashboardService } from './doctor-dashboard.service';

@Module({
  controllers: [DoctorDashboardController],
  providers: [DoctorDashboardService]
})
export class DoctorDashboardModule {}
