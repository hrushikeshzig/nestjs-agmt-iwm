import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductServiceController } from './product-service.controller';
import { ProductServiceService } from './product-service.service';
import { Product } from './entities/product.entity';
import { EnvModule } from '@app/common';
import { DatabaseModule } from '@app/database';
import { MessagingModule, QUEUES } from '@app/messaging';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    RedisModule,
    MessagingModule.forRoot(QUEUES.PRODUCT_SERVICE),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductServiceController],
  providers: [ProductServiceService],
})
export class ProductServiceModule {}
