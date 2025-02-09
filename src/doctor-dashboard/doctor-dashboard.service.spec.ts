import { Test, TestingModule } from '@nestjs/testing';
import { DoctorDashboardService } from './doctor-dashboard.service';

describe('DoctorDashboardService', () => {
  let service: DoctorDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorDashboardService],
    }).compile();

    service = module.get<DoctorDashboardService>(DoctorDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
