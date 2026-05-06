import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ROUTING_KEYS } from '@app/messaging';

@Injectable()
export class OrderServiceService {
  constructor(
    @InjectRepository(Order) private readonly repository: Repository<Order>,
    @Inject('RABBITMQ_PUBLISHER') private readonly publisher: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = await this.repository.save(
      this.repository.create({
        ...dto,
        status: OrderStatus.PENDING,
      }),
    );

    const inventoryBase = this.configService.get<string>(
      'INVENTORY_SERVICE_URL',
      'http://localhost:3001',
    );
    await fetch(`${inventoryBase}/inventory/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        referenceId: order.id,
      }),
    });

    order.status = OrderStatus.CONFIRMED;
    await this.repository.save(order);
    this.publisher.emit(ROUTING_KEYS.ORDER_CONFIRMED, {
      orderId: order.id,
      productId: order.productId,
      warehouseId: order.warehouseId,
      quantity: order.quantity,
      timestamp: new Date().toISOString(),
    });
    return order;
  }

  findAll(): Promise<Order[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.repository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
