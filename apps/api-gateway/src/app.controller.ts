import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Post('products')
  createProduct(@Body() payload: unknown) {
    return this.appService.forwardPost('/products', 'PRODUCT_SERVICE_URL', payload);
  }

  @Get('products')
  getProducts() {
    return this.appService.forwardGet('/products', 'PRODUCT_SERVICE_URL');
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.appService.forwardGet(`/products/${id}`, 'PRODUCT_SERVICE_URL');
  }

  @Post('warehouses')
  createWarehouse(@Body() payload: unknown) {
    return this.appService.forwardPost('/warehouses', 'WAREHOUSE_SERVICE_URL', payload);
  }

  @Get('warehouses')
  getWarehouses() {
    return this.appService.forwardGet('/warehouses', 'WAREHOUSE_SERVICE_URL');
  }

  @Post('inventory/adjust')
  adjustInventory(@Body() payload: unknown) {
    return this.appService.forwardPost('/inventory/adjust', 'INVENTORY_SERVICE_URL', payload);
  }

  @Post('inventory/reserve')
  reserveInventory(@Body() payload: unknown) {
    return this.appService.forwardPost('/inventory/reserve', 'INVENTORY_SERVICE_URL', payload);
  }

  @Get('inventory/available')
  getAvailableInventory(@Query('productId') productId: string, @Query('warehouseId') warehouseId?: string) {
    const query = warehouseId
      ? `/inventory/available?productId=${productId}&warehouseId=${warehouseId}`
      : `/inventory/available?productId=${productId}`;
    return this.appService.forwardGet(query, 'INVENTORY_SERVICE_URL');
  }

  @Post('orders')
  createOrder(@Body() payload: unknown) {
    return this.appService.forwardPost('/orders', 'ORDER_SERVICE_URL', payload);
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.appService.forwardGet(`/orders/${id}`, 'ORDER_SERVICE_URL');
  }
}
