import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctor-dashboard')
export class DoctorDashboardController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getDoctorDashboard() {
    return { message: 'Welcome to the dashboard' };
  }
}
