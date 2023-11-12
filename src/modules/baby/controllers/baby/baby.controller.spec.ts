import { Test, TestingModule } from '@nestjs/testing';
import { BabyController } from './baby.controller';
import { BabyInfoService } from '../../services/baby-info/baby-info.service';

describe('BabyController', () => {
  let controller: BabyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BabyController],
      providers: [
        {
          provide: BabyInfoService,
          useValue: {
            step1: jest.fn(() => ({ isSuccess: true })),
            step2: jest.fn(() => ({ isSuccess: true })),
          },
        },
      ]
    }).compile();

    controller = module.get<BabyController>(BabyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
