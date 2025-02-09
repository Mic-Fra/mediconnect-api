import { Test, TestingModule } from '@nestjs/testing';
import { DoctorDashboardController } from './doctor-dashboard.controller';

describe('DoctorDashboardController', () => {
  let controller: DoctorDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorDashboardController],
    }).compile();

    controller = module.get<DoctorDashboardController>(DoctorDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
