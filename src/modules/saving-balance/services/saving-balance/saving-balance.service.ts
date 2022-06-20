import { EntityManager, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SavingBalanceEntity } from '../../entities/saving-balance.entity';
import { SavingInterestEntity } from '../../entities/saving-interest.entity';

@Injectable()
export class SavingBalanceService {
  constructor(
    @InjectRepository(SavingBalanceEntity)
    private readonly repo: Repository<SavingBalanceEntity>,
  ) {}

  async addDailySavingInterests(
    balanceId: string,
    interestRate: number,
    period: string,
    deleteSqsMessage: () => Promise<void>,
  ) {
    const balance = await this.repo.manager.transaction(
      async (entityManager: EntityManager) => {
        const savingBalance = await entityManager.findOne(
          SavingBalanceEntity,
          { id: balanceId },
          { lock: { mode: 'pessimistic_write' /** SELECT....FOR UPDATE */ } },
        );
        if (!savingBalance) {
          // create new saving balance if not exists yet
          throw new NotFoundException(`Saving balance ${balanceId} not found!`);
        }

        const amount =
          (savingBalance.availableAmount * interestRate) / 100 / 365;

        const savingInterestEntity = new SavingInterestEntity();
        savingInterestEntity.period = period;
        savingInterestEntity.interestRate = interestRate;
        savingInterestEntity.amount = amount;
        savingInterestEntity.savingBalance = savingBalance;
        savingInterestEntity.availableAmountBefore =
          savingBalance.availableAmount;
        savingInterestEntity.availableAmountAfter =
          savingBalance.availableAmount + amount;

        console.log(savingInterestEntity);
        const n = await entityManager.save(savingInterestEntity);

        console.log(n);

        // update availableAmount of current saving balance
        savingBalance.availableAmount = savingBalance.availableAmount + amount;
        const newSavingBalance = entityManager.save(savingBalance);

        await deleteSqsMessage();

        return newSavingBalance;
      },
    );
    return balance;
  }
}
