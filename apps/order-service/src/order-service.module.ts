import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { Order } from './entities/order.entity';
import { EnvModule } from '@app/common';
import { DatabaseModule } from '@app/database';
import { RedisModule } from '@app/redis';
import { MessagingModule, QUEUES } from '@app/messaging';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    RedisModule,
    MessagingModule.forRoot(QUEUES.ORDER_SERVICE),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderServiceController],
  providers: [OrderServiceService],
})
export class OrderServiceModule {}
