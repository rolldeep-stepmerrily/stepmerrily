import { Test, TestingModule } from '@nestjs/testing';

import { MusicsService } from './musics.service';

describe('MusicsService', () => {
  let service: MusicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MusicsService],
    }).compile();

    service = module.get<MusicsService>(MusicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
