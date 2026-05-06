import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WarehouseServiceService } from './warehouse-service.service';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';

@Controller('warehouses')
export class WarehouseServiceController {
  constructor(private readonly warehouseServiceService: WarehouseServiceService) {}

  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseServiceService.create(dto);
  }

  @Get()
  findAll() {
    return this.warehouseServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseServiceService.findOne(id);
  }
}
