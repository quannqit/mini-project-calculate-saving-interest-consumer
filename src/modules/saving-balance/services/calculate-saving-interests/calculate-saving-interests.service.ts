import { SQS } from 'aws-sdk';
import { Consumer, ConsumerOptions, SQSMessage } from 'sqs-consumer';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SavingBalanceService } from '../saving-balance/saving-balance.service';

@Injectable()
export class CalculateSavingInterestsService implements OnModuleInit {
  constructor(
    @Inject('AWS_SQS') private readonly sqs: SQS,
    private readonly savingBalanceService: SavingBalanceService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const QueueUrl = this.configService.get<string>(
      'AWS_SQS_PAY_DAILY_SAVING_INTERESTS_QUEUE_NAME',
    );

    const subscriberDefinition: ConsumerOptions = {
      queueUrl: QueueUrl,
      sqs: this.sqs,
      batchSize: 10,
      handleMessage: async (msg: SQSMessage) => {
        const { balanceId, interestRate, period } = JSON.parse(msg.Body);

        const deleteSqsMessage = async () => {
          await new Promise<void>((resolve, reject) => {
            this.sqs.deleteMessage(
              {
                QueueUrl,
                ReceiptHandle: msg.ReceiptHandle,
              },
              function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              },
            );
          });
        };

        try {
          await this.savingBalanceService.addDailySavingInterests(
            balanceId,
            interestRate,
            period,
            deleteSqsMessage,
          );
          console.log(
            `Finish calculate interest of ${period} for balance ${balanceId} `,
          );
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    };

    const subscriber = Consumer.create(subscriberDefinition);
    subscriber.start();
  }
}
