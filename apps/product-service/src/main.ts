import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@app/messaging';
import { ProductServiceModule } from './product-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${configService.get<string>('RABBITMQ_USER', 'guest')}:${configService.get<string>('RABBITMQ_PASSWORD', 'guest')}@${configService.get<string>('RABBITMQ_HOST', 'localhost')}:${configService.get<number>('RABBITMQ_PORT', 5672)}${configService.get<string>('RABBITMQ_VHOST', '/')}`,
      ],
      queue: QUEUES.PRODUCT_SERVICE,
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PRODUCT_SERVICE_PORT ?? 3002);
}
bootstrap();
