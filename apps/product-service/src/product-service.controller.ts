import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductServiceService } from './product-service.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('products')
export class ProductServiceController {
  constructor(private readonly productServiceService: ProductServiceService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productServiceService.create(dto);
  }

  @Get()
  findAll() {
    return this.productServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productServiceService.findOne(id);
  }
}
