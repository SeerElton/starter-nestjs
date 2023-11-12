import { Test, TestingModule } from '@nestjs/testing';
import { BabyProfileShareController } from './baby-profile-share.controller';
import { BabyProfileService } from '../../services/baby-profile/baby-profile.service';

describe('BabyProfileShareController', () => {
  let controller: BabyProfileShareController;
  let service: BabyProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BabyProfileShareController],

      providers: [
        {
          provide: BabyProfileService,
          useValue: {
            shareProfile: jest.fn(() => ({ isSuccess: true })),

          },
        },
      ]
    }).compile();

    controller = module.get<BabyProfileShareController>(BabyProfileShareController);
    service = module.get<BabyProfileService>(BabyProfileService);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
