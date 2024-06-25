import { Test, TestingModule } from '@nestjs/testing';

import { MusicsController } from './musics.controller';

describe('MusicsController', () => {
  let controller: MusicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicsController],
    }).compile();

    controller = module.get<MusicsController>(MusicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
