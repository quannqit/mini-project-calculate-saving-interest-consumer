import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsServicesModule } from '../aws-services/aws-services.module';
import { SavingBalanceEntity } from './entities/saving-balance.entity';
import { SavingInterestEntity } from './entities/saving-interest.entity';
import { CalculateSavingInterestsService } from './services/calculate-saving-interests/calculate-saving-interests.service';
import { SavingBalanceService } from './services/saving-balance/saving-balance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavingBalanceEntity, SavingInterestEntity]),
    AwsServicesModule,
  ],
  providers: [SavingBalanceService, CalculateSavingInterestsService],
})
export class SavingBalanceModule {}
