import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InventoryServiceService } from './inventory-service.service';
import { ReserveStockDto } from './dtos/reserve-stock.dto';
import { AdjustStockDto } from './dtos/adjust-stock.dto';
import { DatabaseService } from '@app/database';
import { RedisService } from '@app/redis';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ROUTING_KEYS } from '@app/messaging';

@Controller('inventory')
export class InventoryServiceController {
  constructor(
    private readonly inventoryServiceService: InventoryServiceService,
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
  ) {}

  @Post('reserve')
  reserveStock(@Body() dto: ReserveStockDto) {
    return this.inventoryServiceService.reserveStock(dto);
  }

  @Post('release')
  releaseStock(@Body() dto: ReserveStockDto) {
    return this.inventoryServiceService.releaseStock(dto);
  }

  @Post('adjust')
  adjustStock(@Body() dto: AdjustStockDto) {
    return this.inventoryServiceService.adjustStock(dto);
  }

  @Get('available')
  getAvailableStock(@Query('productId') productId: string, @Query('warehouseId') warehouseId?: string) {
    return this.inventoryServiceService.getAvailableStock(productId, warehouseId);
  }

  @Get('movements')
  getMovements(@Query('productId') productId?: string, @Query('warehouseId') warehouseId?: string) {
    return this.inventoryServiceService.getMovements(productId, warehouseId);
  }

  @Get('health')
  async health() {
    const redis = await this.redisService.ping();
    return {
      status: 'ok',
      db: this.databaseService.isInitialized(),
      redis: redis === 'PONG',
      rabbitmq: true,
    };
  }

  @EventPattern(ROUTING_KEYS.ORDER_CANCELLED)
  onOrderCancelled(@Payload() payload: ReserveStockDto) {
    return this.inventoryServiceService.releaseStock(payload);
  }
}
