import { Test, TestingModule } from '@nestjs/testing';
import { BabyGrowthRecordController } from './baby-growth-record.controller';
import { BabyGrowthTrackerService } from '../../services/baby-growth-record/baby-growth-record.service';

describe('BabyGrowthRecordController', () => {
  let controller: BabyGrowthRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BabyGrowthRecordController],
      providers: [
        {
          provide: BabyGrowthTrackerService,
          useValue: {
            step1: jest.fn(() => ({ isSuccess: true })),
            step2: jest.fn(() => ({ isSuccess: true })),
          },
        }
      ]
    }).compile();

    controller = module.get<BabyGrowthRecordController>(BabyGrowthRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
