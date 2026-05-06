import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateProductDto } from 'apps/product-service/src/dtos/create-product.dto';
import { CreateWarehouseDto } from 'apps/warehouse-service/src/dtos/create-warehouse.dto';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }

  async forwardGet(path: string, serviceKey: string): Promise<unknown> {
    const baseUrl = this.configService.get<string>(serviceKey);
    const response = await fetch(`${baseUrl}${path}`);
    return response.json();
  }

  async forwardPost(path: string, serviceKey: string, payload: unknown): Promise<unknown> {
    const baseUrl = this.configService.get<string>(serviceKey);
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.json();
  }
}
