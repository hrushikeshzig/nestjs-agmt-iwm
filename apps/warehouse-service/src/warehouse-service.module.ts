import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseServiceController } from './warehouse-service.controller';
import { WarehouseServiceService } from './warehouse-service.service';
import { Warehouse } from './entities/warehouse.entity';
import { EnvModule } from '@app/common';
import { DatabaseModule } from '@app/database';
import { MessagingModule, QUEUES } from '@app/messaging';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    RedisModule,
    MessagingModule.forRoot(QUEUES.WAREHOUSE_SERVICE),
    TypeOrmModule.forFeature([Warehouse]),
  ],
  controllers: [WarehouseServiceController],
  providers: [WarehouseServiceService],
})
export class WarehouseServiceModule {}
