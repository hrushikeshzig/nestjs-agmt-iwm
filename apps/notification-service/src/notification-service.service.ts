import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/redis';

@Injectable()
export class NotificationServiceService {
  constructor(private readonly redisService: RedisService) {}

  private async deduplicate(eventKey: string): Promise<boolean> {
    const existing = await this.redisService.get<boolean>(eventKey);
    if (existing) {
      return false;
    }
    await this.redisService.set(eventKey, true, 300);
    return true;
  }

  notifyLowStock(payload: Record<string, unknown>) {
    return this.handleEvent('stock-low', payload, 'Low stock alert accepted');
  }

  notifyStockOut(payload: Record<string, unknown>) {
    return this.handleEvent('stock-out', payload, 'Stock out alert accepted');
  }

  private async handleEvent(kind: string, payload: Record<string, unknown>, message: string) {
    const eventId = String(payload.inventoryId ?? payload.referenceId ?? 'unknown');
    const accepted = await this.deduplicate(`notification:${kind}:${eventId}`);
    if (!accepted) {
      return { message: 'Duplicate event ignored', payload };
    }
    return {
      message,
      payload,
    };
  }
}
