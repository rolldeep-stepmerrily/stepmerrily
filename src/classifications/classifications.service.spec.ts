import { Test, TestingModule } from '@nestjs/testing';

import { ClassificationsService } from './classifications.service';

describe('ClassificationsService', () => {
  let service: ClassificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassificationsService],
    }).compile();

    service = module.get<ClassificationsService>(ClassificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
