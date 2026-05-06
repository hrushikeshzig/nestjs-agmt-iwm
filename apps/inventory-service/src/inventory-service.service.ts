import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { StockMovement } from './entities/stock-movement.entity';
import { ReserveStockDto } from './dtos/reserve-stock.dto';
import { MovementType } from './enums/movement-type.enum';
import { AdjustStockDto } from './dtos/adjust-stock.dto';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '@app/redis';
import { ROUTING_KEYS } from '@app/messaging';

@Injectable()
export class InventoryServiceService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    private dataSource: DataSource,
    @Inject('RABBITMQ_PUBLISHER')
    private publisher: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  async reserveStock(stockDto: ReserveStockDto): Promise<Inventory> {
    const inventory = await this.dataSource.transaction(async (manager) => {
      const inventory = await manager.findOne(Inventory, {
        where: {
          productId: stockDto.productId,
          warehouseId: stockDto.warehouseId,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory not found');
      }

      const availableQuantity = inventory.quantity - inventory.reservedQuantity;

      if (availableQuantity < stockDto.quantity) {
        throw new BadRequestException('Insufficient stock available');
      }
      inventory.reservedQuantity += stockDto.quantity;
      await manager.save(inventory);

      const movement = manager.create(StockMovement, {
        inventoryId: inventory.id,
        productId: stockDto.productId,
        warehouseId: stockDto.warehouseId,
        quantity: stockDto.quantity,
        type: MovementType.RESERVATION,
        referenceId: stockDto.referenceId,
        referenceType: 'ORDER',
        performedBy: stockDto.performedBy,
      });
      await manager.save(movement);

      this.checkLowStockThreshold(inventory);

      return inventory;
    });
    await this.invalidateStockCache(stockDto.productId, stockDto.warehouseId);
    this.publisher.emit(ROUTING_KEYS.STOCK_RESERVED, {
      inventoryId: inventory.id,
      ...stockDto,
      timestamp: new Date().toISOString(),
    });
    return inventory;
  }

  async releaseStock(stockDto: ReserveStockDto): Promise<Inventory> {
    const inventory = await this.dataSource.transaction(async (manager) => {
      const inventory = await manager.findOne(Inventory, {
        where: {
          productId: stockDto.productId,
          warehouseId: stockDto.warehouseId,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory not found');
      }

      inventory.reservedQuantity = Math.max(0, inventory.reservedQuantity - stockDto.quantity);

      await manager.save(inventory);

      const movement = manager.create(StockMovement, {
        inventoryId: inventory.id,
        productId: stockDto.productId,
        warehouseId: stockDto.warehouseId,
        quantity: stockDto.quantity,
        type: MovementType.RELEASE,
        referenceId: stockDto.referenceId,
        referenceType: 'ORDER',
        performedBy: stockDto.performedBy,
      });
      await manager.save(movement);

      return inventory;
    });
    await this.invalidateStockCache(stockDto.productId, stockDto.warehouseId);
    this.publisher.emit(ROUTING_KEYS.STOCK_RELEASED, {
      inventoryId: inventory.id,
      ...stockDto,
      timestamp: new Date().toISOString(),
    });
    return inventory;
  }

  async adjustStock(stockDto: AdjustStockDto): Promise<Inventory> {
    const inventory = await this.dataSource.transaction(async (manager) => {
      let inventory = await manager.findOne(Inventory, {
        where: {
          productId: stockDto.productId,
          warehouseId: stockDto.warehouseId,
        },
      });
      if (!inventory) {
        inventory = manager.create(Inventory, {
          productId: stockDto.productId,
          warehouseId: stockDto.warehouseId,
          quantity: 0,
        });
      }
      inventory.quantity += stockDto.quantity;
      await manager.save(inventory);

      const movement = manager.create(StockMovement, {
        inventoryId: inventory.id,
        productId: stockDto.productId,
        warehouseId: stockDto.warehouseId,
        quantity: stockDto.quantity,
        type: stockDto.quantity > 0 ? MovementType.STOCK_IN : MovementType.STOCK_OUT,
        reason: stockDto.reason,
        performedBy: stockDto.performedBy,
      });
      await manager.save(movement);

      this.checkLowStockThreshold(inventory);

      return inventory;
    });
    await this.invalidateStockCache(stockDto.productId, stockDto.warehouseId);
    this.publisher.emit(ROUTING_KEYS.STOCK_ADJUSTED, {
      inventoryId: inventory.id,
      productId: stockDto.productId,
      warehouseId: stockDto.warehouseId,
      quantity: stockDto.quantity,
      timestamp: new Date().toISOString(),
    });
    return inventory;
  }

  private checkLowStockThreshold(inventory: Inventory): void {
    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    if (inventory.lowStockThreshold && availableQuantity <= inventory.lowStockThreshold) {
      this.publisher.emit(ROUTING_KEYS.STOCK_LOW, {
        inventoryId: inventory.id,
        productId: inventory.productId,
        warehouseId: inventory.warehouseId,
        availableQuantity,
        threshold: inventory.lowStockThreshold,
        timestamp: new Date().toISOString(),
      });
    }
    if (availableQuantity === 0) {
      this.publisher.emit(ROUTING_KEYS.STOCK_OUT, {
        inventoryId: inventory.id,
        productId: inventory.productId,
        warehouseId: inventory.warehouseId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getAvailableStock(productId: string, warehouseId?: string): Promise<number> {
    const cacheKey = `inventory:available:${productId}:${warehouseId ?? 'all'}`;
    const cachedValue = await this.redisService.get<number>(cacheKey);
    if (cachedValue !== null) {
      return cachedValue;
    }

    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.quantity - inventory.reservedQuantity)', 'available')
      .where('inventory.productId = :productId', { productId });
    if (warehouseId) {
      query.andWhere('inventory.warehouseId = :warehouseId', { warehouseId });
    }
    const result = await query.getRawOne();
    const available = Number(result?.available) || 0;
    await this.redisService.set(cacheKey, available);
    return available;
  }

  async getMovements(productId?: string, warehouseId?: string): Promise<StockMovement[]> {
    const query = this.stockMovementRepository
      .createQueryBuilder('movement')
      .orderBy('movement.createdAt', 'DESC')
      .take(100);
    if (productId) {
      query.andWhere('movement.productId = :productId', { productId });
    }
    if (warehouseId) {
      query.andWhere('movement.warehouseId = :warehouseId', { warehouseId });
    }
    return query.getMany();
  }

  private async invalidateStockCache(productId: string, warehouseId: string): Promise<void> {
    await Promise.all([
      this.redisService.del(`inventory:available:${productId}:${warehouseId}`),
      this.redisService.del(`inventory:available:${productId}:all`),
    ]);
  }
}
