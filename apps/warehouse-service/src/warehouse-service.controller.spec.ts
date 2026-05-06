import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseServiceController } from './warehouse-service.controller';
import { WarehouseServiceService } from './warehouse-service.service';

describe('WarehouseServiceController', () => {
  let warehouseServiceController: WarehouseServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseServiceController],
      providers: [WarehouseServiceService],
    }).compile();

    warehouseServiceController = app.get<WarehouseServiceController>(WarehouseServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(warehouseServiceController.getHello()).toBe('Hello World!');
    });
  });
});
