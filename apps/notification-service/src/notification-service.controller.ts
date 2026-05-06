import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationServiceService } from './notification-service.service';
import { ROUTING_KEYS } from '@app/messaging';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationServiceService: NotificationServiceService) {}

  @Get()
  getHello(): string {
    return 'notification-service';
  }

  @EventPattern(ROUTING_KEYS.STOCK_LOW)
  onStockLow(@Payload() payload: Record<string, unknown>) {
    return this.notificationServiceService.notifyLowStock(payload);
  }

  @EventPattern(ROUTING_KEYS.STOCK_OUT)
  onStockOut(@Payload() payload: Record<string, unknown>) {
    return this.notificationServiceService.notifyStockOut(payload);
  }
}
