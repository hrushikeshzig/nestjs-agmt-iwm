import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';

@Injectable()
export class WarehouseServiceService {
  constructor(@InjectRepository(Warehouse) private readonly repository: Repository<Warehouse>) {}

  create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<Warehouse[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.repository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    return warehouse;
  }
}
