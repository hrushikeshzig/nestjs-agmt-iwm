import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductServiceService {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}


  create(dto: CreateProductDto): Promise<Product> {
    const entity = this.productRepository.create(dto);
    return this.productRepository.save(entity);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
