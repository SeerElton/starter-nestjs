import { Test, TestingModule } from '@nestjs/testing';
import { ImmunizationTimelineService } from './immunization-timeline.service';

describe('ImmunizationTimelineService', () => {
  let service: ImmunizationTimelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImmunizationTimelineService],
    }).compile();

    service = module.get<ImmunizationTimelineService>(ImmunizationTimelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
