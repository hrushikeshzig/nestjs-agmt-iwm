import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { EnvModule } from '@app/common';
import { MessagingModule, QUEUES } from '@app/messaging';
import { RedisModule } from '@app/redis';

@Module({
  imports: [EnvModule, RedisModule, MessagingModule.forRoot(QUEUES.NOTIFICATION_SERVICE)],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
