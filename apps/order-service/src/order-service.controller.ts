import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderServiceService } from './order-service.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderServiceService.create(dto);
  }

  @Get()
  findAll() {
    return this.orderServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderServiceService.findOne(id);
  }
}
