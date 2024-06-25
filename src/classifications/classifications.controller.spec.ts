import { Test, TestingModule } from '@nestjs/testing';

import { ClassificationsController } from './classifications.controller';

describe('ClassificationsController', () => {
  let controller: ClassificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassificationsController],
    }).compile();

    controller = module.get<ClassificationsController>(ClassificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
