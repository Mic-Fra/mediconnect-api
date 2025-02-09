// src/doctor-dashboard/doctor-dashboard.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorDashboardService {
  // This service can fetch data, manage state, etc.
  // For now, we are returning a simple message or can add real data fetching logic

  getDashboardData(): string {
    // Fetch and return actual data as needed, e.g., doctors, appointments, etc.
    return 'Doctor Dashboard data will go here';
  }
}
