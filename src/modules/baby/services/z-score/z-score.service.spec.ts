import { Test, TestingModule } from '@nestjs/testing';
import { ZScoreService } from './z-score.service';

describe('ZScoreService', () => {
  let service: ZScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZScoreService],
    }).compile();

    service = module.get<ZScoreService>(ZScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
