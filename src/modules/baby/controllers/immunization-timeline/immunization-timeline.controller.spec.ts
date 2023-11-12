import { Test, TestingModule } from '@nestjs/testing';
import { ImmunizationTimelineController } from './immunization-timeline.controller';

describe('ImmunizationTimelineController', () => {
  let controller: ImmunizationTimelineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImmunizationTimelineController],
    }).compile();

    controller = module.get<ImmunizationTimelineController>(ImmunizationTimelineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
