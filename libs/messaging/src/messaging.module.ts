import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUES } from './constants/queues.constant';

@Global()
@Module({})
export class MessagingModule {
  static forRoot(serviceQueue: string = QUEUES.INVENTORY_SERVICE): DynamicModule {
    return {
      module: MessagingModule,
      imports: [
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: 'RABBITMQ_PUBLISHER',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  `amqp://${configService.get<string>('RABBITMQ_USER', 'guest')}:${configService.get<string>('RABBITMQ_PASSWORD', 'guest')}@${configService.get<string>('RABBITMQ_HOST', 'localhost')}:${configService.get<number>('RABBITMQ_PORT', 5672)}${configService.get<string>('RABBITMQ_VHOST', '/')}`,
                ],
                queue: serviceQueue,
                queueOptions: {
                  durable: true,
                  arguments: {
                    'x-dead-letter-exchange': '',
                    'x-dead-letter-routing-key': `${serviceQueue}.dlq`,
                  },
                },
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}