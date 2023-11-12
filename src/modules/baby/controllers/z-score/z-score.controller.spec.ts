import { Test, TestingModule } from '@nestjs/testing';
import { ZScoreController } from './z-score.controller';

describe('ZScoreController', () => {
  let controller: ZScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZScoreController],
    }).compile();

    controller = module.get<ZScoreController>(ZScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
