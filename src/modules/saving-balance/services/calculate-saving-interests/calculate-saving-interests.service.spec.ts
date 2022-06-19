import { Test, TestingModule } from '@nestjs/testing';

import { CalculateSavingInterestsService } from './calculate-saving-interests.service';

describe('CalculateSavingInterestsService', () => {
  let service: CalculateSavingInterestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculateSavingInterestsService],
    }).compile();

    service = module.get<CalculateSavingInterestsService>(
      CalculateSavingInterestsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
