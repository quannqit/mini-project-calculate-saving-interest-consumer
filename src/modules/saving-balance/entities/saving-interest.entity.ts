import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SavingBalanceEntity } from './saving-balance.entity';

@Entity('saving-interests')
export class SavingInterestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @JoinColumn()
  @ManyToOne(() => SavingBalanceEntity)
  savingBalance!: SavingBalanceEntity;

  @Column({ type: 'double precision' })
  public interestRate!: number;

  @Column({ unique: true })
  public period: string;

  @Column({ type: 'double precision' })
  public amount!: number;

  @Column({ type: 'double precision' })
  public availableAmountBefore!: number;

  @Column({ type: 'double precision' })
  public availableAmountAfter!: number;

  @CreateDateColumn()
  public createdAt!: Date;
}
