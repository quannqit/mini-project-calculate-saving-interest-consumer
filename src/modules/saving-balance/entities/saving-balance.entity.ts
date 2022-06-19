import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('saving-balances')
@Index('createdAt')
export class SavingBalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  public userId!: string;

  @Column({ type: 'double precision' })
  public availableAmount!: number;

  @CreateDateColumn()
  public createdAt!: Date;
}
