import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryServiceService } from './inventory-service.service';
import { Inventory } from './entities/inventory.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { EnvModule } from '@app/common';
import { DatabaseModule } from '@app/database';
import { RedisModule } from '@app/redis';
import { MessagingModule, QUEUES } from '@app/messaging';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    RedisModule,
    MessagingModule.forRoot(QUEUES.INVENTORY_SERVICE),
    TypeOrmModule.forFeature([Inventory, StockMovement]),
  ],
  controllers: [InventoryServiceController],
  providers: [InventoryServiceService],
})
export class InventoryServiceModule {}
